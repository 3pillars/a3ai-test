# Quant Simulation Techniques

Reference: Monte Carlo, Importance Sampling, Particle Filters, Variance Reduction, Copulas

## Part I: Monte Carlo Fundamentals

### Binary Contract Simulation
```python
import numpy as np

def simulate_binary_contract(S0, K, mu, sigma, T, N_paths=100_000):
    Z = np.random.standard_normal(N_paths)
    S_T = S0 * np.exp((mu - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)
    payoffs = (S_T > K).astype(float)
    
    p_hat = payoffs.mean()
    se = np.sqrt(p_hat * (1 - p_hat) / N_paths)
    ci_lower = p_hat - 1.96 * se
    ci_upper = p_hat + 1.96 * se
    
    return {'probability': p_hat, 'std_error': se, 'ci_95': (ci_lower, ci_upper)}
```

### Brier Score (Calibration)
```python
def brier_score(predictions, outcomes):
    return np.mean((np.array(predictions) - np.array(outcomes))**2)
# < 0.20 good, < 0.10 excellent
```

---

## Part II: Importance Sampling (Rare Events)

For tail-risk contracts (e.g., "Will S&P drop 20% in one week?")

```python
def rare_event_IS(S0, K_crash, sigma, T, N_paths=100_000):
    K = S0 * (1 - K_crash)
    mu_original = -0.5 * sigma**2
    log_threshold = np.log(K / S0)
    mu_tilt = log_threshold / T
    
    Z = np.random.standard_normal(N_paths)
    log_returns_tilted = mu_tilt * T + sigma * np.sqrt(T) * Z
    S_T_tilted = S0 * np.exp(log_returns_tilted)
    
    log_LR = (
        -0.5 * ((log_returns_tilted - mu_original * T) / (sigma * np.sqrt(T)))**2
        + 0.5 * ((log_returns_tilted - mu_tilt * T) / (sigma * np.sqrt(T)))**2
    )
    LR = np.exp(log_LR)
    
    payoffs = (S_T_tilted < K).astype(float)
    is_estimates = payoffs * LR
    
    return {
        'p_IS': is_estimates.mean(),
        'se_IS': is_estimates.std() / np.sqrt(N_paths),
        'variance_reduction': '100-10000x vs crude MC'
    }
```

**Key insight**: Variance reduction 100-10000x means 100 IS samples > 1M crude samples.

---

## Part III: Sequential Monte Carlo / Particle Filter

Real-time probability updating (e.g., election night)

```python
import numpy as np
from scipy.special import expit, logit

class PredictionMarketParticleFilter:
    def __init__(self, N_particles=5000, prior_prob=0.5,
                 process_vol=0.05, obs_noise=0.03):
        self.N = N_particles
        self.process_vol = process_vol
        self.obs_noise = obs_noise
        
        logit_prior = logit(prior_prob)
        self.logit_particles = logit_prior + np.random.normal(0, 0.5, N_particles)
        self.weights = np.ones(N_particles) / N_particles
        self.history = []
    
    def update(self, observed_price):
        # Propagate
        noise = np.random.normal(0, self.process_vol, self.N)
        self.logit_particles += noise
        
        # Reweight
        prob_particles = expit(self.logit_particles)
        log_likelihood = -0.5 * ((observed_price - prob_particles) / self.obs_noise)**2
        log_weights = np.log(self.weights + 1e-300) + log_likelihood
        log_weights -= log_weights.max()
        self.weights = np.exp(log_weights)
        self.weights /= self.weights.sum()
        
        # Resample if ESS < N/2
        ess = 1.0 / np.sum(self.weights**2)
        if ess < self.N / 2:
            self._systematic_resample()
        
        self.history.append(self.estimate())
    
    def _systematic_resample(self):
        cumsum = np.cumsum(self.weights)
        u = (np.arange(self.N) + np.random.uniform()) / self.N
        indices = np.searchsorted(cumsum, u)
        self.logit_particles = self.logit_particles[indices]
        self.weights = np.ones(self.N) / self.N
    
    def estimate(self):
        probs = expit(self.logit_particles)
        return np.average(probs, weights=self.weights)
```

---

## Part IV: Variance Reduction (Stackable)

### 1. Antithetic Variates
```python
# Run twice with Z and -Z, average results
# 50-75% variance reduction, free
```

### 2. Control Variates
```python
# Use Black-Scholes digital price as control
# Reduces variance when simulating with stochastic vol
```

### 3. Stratified Sampling
```python
def stratified_binary_mc(S0, K, sigma, T, J=10, N_total=100_000):
    n_per_stratum = N_total // J
    estimates = []
    for j in range(J):
        U = np.random.uniform(j/J, (j+1)/J, n_per_stratum)
        Z = norm.ppf(U)
        S_T = S0 * np.exp((-0.5*sigma**2)*T + sigma*np.sqrt(T)*Z)
        estimates.append((S_T > K).mean())
    return np.mean(estimates), np.std(estimates) / np.sqrt(J)
```

**Stack all three**: 100-500x variance reduction is achievable.

---

## Part V: Copulas for Correlation

### Gaussian vs Student-t (Tail Dependence)

```python
import numpy as np
from scipy.stats import norm, t as t_dist

def simulate_correlated_outcomes_t(probs, corr_matrix, nu=4, N=100_000):
    """Student-t copula with tail dependence"""
    d = len(probs)
    L = np.linalg.cholesky(corr_matrix)
    Z = np.random.standard_normal((N, d))
    X = Z @ L.T
    S = np.random.chisquare(nu, N) / nu
    T = X / np.sqrt(S[:, None])
    U = t_dist.cdf(T, nu)
    return (U < np.array(probs)).astype(int)
```

**Key insight**: 
- Gaussian copula: λ = 0 (no tail dependence) - DANGEROUS
- Student-t (ν=4, ρ=0.6): λ ≈ 0.18 (18% tail dependence)
- t-copula shows 2-5x higher extreme joint outcomes

**This is why Gaussian copula failed in 2008** - same issue applies to prediction markets.

### Clayton Copula (Lower tail only)
For when one market "crashes", others follow.

---

## Key Formulas Summary

| Concept | Formula |
|---------|---------|
| GBM Terminal Price | S_T = S_0 * exp((μ - σ²/2)T + σ√T Z) |
| MC Std Error | SE = √(p(1-p)/N) |
| Sample Size for ±0.01 | N = p(1-p) / 0.0001 |
| Lundberg IS | M(γ) = 1 (solve for γ) |
| Brier Score | MSE of predictions |

---

## Source
gemchanger @gemchange_ltd - "How to Simulate Like a Quant Desk"
