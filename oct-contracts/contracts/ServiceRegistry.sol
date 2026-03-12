// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ServiceRegistry
 * @notice Registry for AI services with usage tracking and payment distribution
 * @dev Allows service providers to register, set pricing, and receive payments
 *
 * Features:
 * - Register AI services with metadata
 * - Define pricing for different service tiers
 * - Track usage per user/service
 * - Distribute payments to service providers
 * - Emergency controls
 *
 * Fee Structure:
 * - AI Request (basic): 0.1 OCT
 * - AI Request (advanced): 1-10 OCT
 * - Memory Query: 0.01 OCT
 * - Agent Listing: 10 OCT
 * - Skill Encoding: 50 OCT
 */
contract ServiceRegistry is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice OCT token interface
    IERC20 public immutable octToken;

    /// @notice Service tier enum
    enum ServiceTier {
        Basic,      // 0.1 OCT
        Standard,   // 1 OCT
        Advanced,   // 5 OCT
        Premium     // 10 OCT
    }

    /// @notice Service information struct
    struct Service {
        string name;
        string description;
        string metadataURI; // IPFS or HTTP URL
        address provider;
        ServiceTier tier;
        uint256 price; // Price in OCT (wei)
        uint256 usageCount;
        uint256 totalRevenue;
        bool isActive;
        uint256 registeredAt;
    }

    /// @notice User usage record
    struct UsageRecord {
        uint256 totalSpent;
        uint256 requestCount;
        mapping(bytes32 => uint256) serviceUsage; // serviceId => usage count
    }

    /// @notice Services mapping
    mapping(bytes32 => Service) public services;

    /// @notice Service IDs by provider
    mapping(address => bytes32[]) public providerServices;

    /// @notice User usage records
    mapping(address => UsageRecord) public userUsage;

    /// @notice Provider earnings
    mapping(address => uint256) public providerEarnings;

    /// @notice Service ID list
    bytes32[] public serviceIds;

    /// @notice Treasury address
    address public treasury;

    /// @notice Platform fee (in basis points, 500 = 5%)
    uint256 public platformFee = 500;

    /// @notice Minimum service price (0.01 OCT)
    uint256 public constant MIN_PRICE = 0.01e18;

    /// @notice Maximum description length
    uint256 public constant MAX_DESCRIPTION_LENGTH = 1000;

    /// @notice Emitted when service is registered
    event ServiceRegistered(
        bytes32 indexed serviceId,
        string name,
        address indexed provider,
        ServiceTier tier,
        uint256 price
    );

    /// @notice Emitted when service is updated
    event ServiceUpdated(
        bytes32 indexed serviceId,
        string description,
        string metadataURI,
        uint256 price
    );

    /// @notice Emitted when service is activated/deactivated
    event ServiceStatusChanged(
        bytes32 indexed serviceId,
        bool isActive
    );

    /// @notice Emitted when service is used
    event ServiceUsed(
        bytes32 indexed serviceId,
        address indexed user,
        uint256 amount,
        uint256 newTotalSpent
    );

    /// @notice Emitted when payment is distributed
    event PaymentDistributed(
        bytes32 indexed serviceId,
        address indexed provider,
        uint256 providerAmount,
        uint256 platformFee
    );

    /// @notice Emitted when platform fee is updated
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);

    /// @notice Emitted when treasury is updated
    event TreasuryUpdated(address oldTreasury, address newTreasury);

    /**
     * @notice Constructor initializes service registry
     * @param _octToken OCT token address
     * @param _treasury Treasury address
     */
    constructor(address _octToken, address _treasury) Ownable(msg.sender) {
        require(_octToken != address(0), "ServiceRegistry: zero token address");
        require(_treasury != address(0), "ServiceRegistry: zero treasury address");
        
        octToken = IERC20(_octToken);
        treasury = _treasury;
    }

    /**
     * @notice Register a new AI service
     * @param name Service name
     * @param description Service description
     * @param metadataURI URI for service metadata
     * @param tier Service tier
     * @param price Service price in OCT
     * @return serviceId Generated service ID
     */
    function registerService(
        string calldata name,
        string calldata description,
        string calldata metadataURI,
        ServiceTier tier,
        uint256 price
    ) external whenNotPaused returns (bytes32) {
        require(bytes(name).length > 0, "ServiceRegistry: empty name");
        require(bytes(description).length <= MAX_DESCRIPTION_LENGTH, "ServiceRegistry: description too long");
        require(price >= MIN_PRICE, "ServiceRegistry: price too low");

        // Generate unique service ID
        bytes32 serviceId = keccak256(
            abi.encodePacked(msg.sender, name, block.timestamp)
        );

        require(services[serviceId].registeredAt == 0, "ServiceRegistry: service exists");

        // Create service
        services[serviceId] = Service({
            name: name,
            description: description,
            metadataURI: metadataURI,
            provider: msg.sender,
            tier: tier,
            price: price,
            usageCount: 0,
            totalRevenue: 0,
            isActive: true,
            registeredAt: block.timestamp
        });

        serviceIds.push(serviceId);
        providerServices[msg.sender].push(serviceId);

        emit ServiceRegistered(serviceId, name, msg.sender, tier, price);
        return serviceId;
    }

    /**
     * @notice Update service details
     * @param serviceId Service ID
     * @param description New description
     * @param metadataURI New metadata URI
     * @param price New price
     */
    function updateService(
        bytes32 serviceId,
        string calldata description,
        string calldata metadataURI,
        uint256 price
    ) external whenNotPaused {
        Service storage service = services[serviceId];
        require(service.provider == msg.sender, "ServiceRegistry: not provider");
        require(service.registeredAt > 0, "ServiceRegistry: service not found");
        require(price >= MIN_PRICE, "ServiceRegistry: price too low");

        service.description = description;
        service.metadataURI = metadataURI;
        service.price = price;

        emit ServiceUpdated(serviceId, description, metadataURI, price);
    }

    /**
     * @notice Toggle service active status
     * @param serviceId Service ID
     * @param isActive New active status
     */
    function setServiceStatus(bytes32 serviceId, bool isActive) external {
        Service storage service = services[serviceId];
        require(service.provider == msg.sender, "ServiceRegistry: not provider");
        require(service.registeredAt > 0, "ServiceRegistry: service not found");

        service.isActive = isActive;
        emit ServiceStatusChanged(serviceId, isActive);
    }

    /**
     * @notice Use a service and make payment (internal version)
     * @param serviceId Service ID
     * @param amount Amount to pay
     */
    function _useService(bytes32 serviceId, uint256 amount) internal {
        Service storage service = services[serviceId];
        
        // Calculate platform fee and provider share
        uint256 fee = (amount * platformFee) / 10000;
        uint256 providerShare = amount - fee;

        // Update service stats
        service.usageCount += 1;
        service.totalRevenue += amount;

        // Update user usage
        UsageRecord storage record = userUsage[msg.sender];
        record.totalSpent += amount;
        record.requestCount += 1;
        record.serviceUsage[serviceId] += 1;

        // Update provider earnings
        providerEarnings[service.provider] += providerShare;

        // Transfer to treasury (platform fee)
        if (fee > 0) {
            octToken.safeTransfer(treasury, fee);
        }

        // Transfer to provider
        octToken.safeTransfer(service.provider, providerShare);

        emit ServiceUsed(serviceId, msg.sender, amount, record.totalSpent);
        emit PaymentDistributed(serviceId, service.provider, providerShare, fee);
    }

    /**
     * @notice Use a service and make payment
     * @param serviceId Service ID
     * @param amount Amount to pay (should match service price)
     */
    function useService(bytes32 serviceId, uint256 amount) external nonReentrant whenNotPaused {
        Service storage service = services[serviceId];
        require(service.registeredAt > 0, "ServiceRegistry: service not found");
        require(service.isActive, "ServiceRegistry: service not active");
        require(amount >= service.price, "ServiceRegistry: insufficient payment");

        // Transfer tokens from user
        octToken.safeTransferFrom(msg.sender, address(this), amount);

        _useService(serviceId, amount);
    }

    /**
     * @notice Batch use multiple services
     * @param _serviceIds Array of service IDs
     * @param amounts Array of amounts
     */
    function batchUseServices(
        bytes32[] calldata _serviceIds,
        uint256[] calldata amounts
    ) external nonReentrant whenNotPaused {
        require(_serviceIds.length == amounts.length, "ServiceRegistry: length mismatch");
        require(_serviceIds.length > 0, "ServiceRegistry: empty array");
        require(_serviceIds.length <= 10, "ServiceRegistry: too many services");

        for (uint256 i = 0; i < _serviceIds.length; i++) {
            require(amounts[i] > 0, "ServiceRegistry: zero amount");
            _useService(_serviceIds[i], amounts[i]);
        }
    }

    /**
     * @notice Provider claims earnings
     * @return Amount claimed
     */
    function claimEarnings() external nonReentrant returns (uint256) {
        uint256 earnings = providerEarnings[msg.sender];
        require(earnings > 0, "ServiceRegistry: no earnings");

        providerEarnings[msg.sender] = 0;
        octToken.safeTransfer(msg.sender, earnings);

        return earnings;
    }

    /**
     * @notice Get pending earnings for provider
     * @param provider Provider address
     * @return Pending earnings
     */
    function pendingEarnings(address provider) external view returns (uint256) {
        return providerEarnings[provider];
    }

    /**
     * @notice Get service details
     * @param serviceId Service ID
     * @return Service struct
     */
    function getService(bytes32 serviceId) external view returns (Service memory) {
        return services[serviceId];
    }

    /**
     * @notice Get services by provider
     * @param provider Provider address
     * @return Array of service IDs
     */
    function getProviderServices(address provider) external view returns (bytes32[] memory) {
        return providerServices[provider];
    }

    /**
     * @notice Get user usage for specific service
     * @param user User address
     * @param serviceId Service ID
     * @return Usage count
     */
    function getUserServiceUsage(address user, bytes32 serviceId) external view returns (uint256) {
        return userUsage[user].serviceUsage[serviceId];
    }

    /**
     * @notice Get total number of services
     * @return Service count
     */
    function getServiceCount() external view returns (uint256) {
        return serviceIds.length;
    }

    /**
     * @notice Set platform fee
     * @param newFee New fee (in basis points, max 2000 = 20%)
     */
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 2000, "ServiceRegistry: fee too high");
        uint256 oldFee = platformFee;
        platformFee = newFee;
        emit PlatformFeeUpdated(oldFee, newFee);
    }

    /**
     * @notice Set treasury address
     * @param newTreasury New treasury address
     */
    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "ServiceRegistry: zero treasury");
        address oldTreasury = treasury;
        treasury = newTreasury;
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    /**
     * @notice Pause registry
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause registry
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Get service price by tier
     * @param tier Service tier
     * @return Default price for tier
     */
    function getDefaultPriceByTier(ServiceTier tier) external pure returns (uint256) {
        if (tier == ServiceTier.Basic) return 0.1e18;
        if (tier == ServiceTier.Standard) return 1e18;
        if (tier == ServiceTier.Advanced) return 5e18;
        if (tier == ServiceTier.Premium) return 10e18;
        return 0;
    }
}
