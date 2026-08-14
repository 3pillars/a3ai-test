# Weekly Research Findings — 2026-08-14

## 1) Quantitative Finance / Monte Carlo / Trading
- Monte Carlo remains the core tool for strategy stress-testing: run thousands of randomized scenarios by resampling historical return distributions to map expected returns, drawdowns, and **risk of ruin**.
- **Trend:** hybrid pipelines — ensemble ML (Random Forest, SVM, LSTM) feeding/combined with MC scenario analysis — improve predictive accuracy and tail-risk estimation.
- MC-based assessment shown more accurate at forecasting extreme/tail events → better risk alerts for institutions.
- Practical takeaway for Jacob's automation goal: bolt a MC drawdown/risk-of-ruin sim onto any strategy before sizing positions; validates position sizing for the $5k/mo passive target.
- Sources: [AIMS QFE (MC + ensemble ML)](http://www.aimspress.com/article/doi/10.3934/QFE.2024011), [QuantPedia MC strategy sim](https://quantpedia.com/introduction-and-examples-of-monte-carlo-strategy-simulation/), [IBKR Quant](https://www.interactivebrokers.com/campus/ibkr-quant-news/power-of-monte-carlo-simulations-in-finance/)

## 2) AI Agents / LLMs (August 2026)
- **Anthropic shipped Claude Opus 5** at ~half the price of comparable frontier models.
- **OpenAI GPT-5.6** launched with "ChatGPT Work" agent; **Google Gemini 3.7 Flash** released Aug 13, 2026. ~10 new models in August.
- **MCP** (Model Context Protocol) shipped a major RC — becoming the standard for agents brokering access to production/business systems.
- Small-model leap: **7B models now beat last year's 70B**; strong local agents viable → cheaper routing for routine tasks (relevant to our tiering strategy).
- Direction: AI getting operational/embedded in enterprise workflows; heavier emphasis on eval + governance.
- Sources: [augusto.digital LLM news Aug 2026](https://augusto.digital/insights/blogs/monthly-llm-news-august-2026/), [llm-stats news](https://llm-stats.com/ai-news), [LLM Gateway timeline](https://llmgateway.io/timeline)

## 3) Bitcoin / Crypto Market (as of Aug 12, 2026)
- **BTC ~$64,200** — down ~27% YTD, ~49% below Oct 2025 ATH of $126,080. Market cap ~$1.3T.
- Range-bound: **$62,500 support**, **$65k–$70k resistance**; trading below key MAs.
- **Fear & Greed Index: 29 (Fear)**; technicals bearish.
- Forecast clustering: most projections **$65k–$80k**; AI-model range $50k–$99k. Whales reportedly betting against a 4-year losing streak.
- Note vs Jacob's alert band ($60k–$80k): BTC sitting near the bottom of that band — worth watching for a support break below $62.5k.
- Sources: [TheStreet BTC Aug 12](https://www.thestreet.com/crypto/markets/bitcoin-price-today-august-12-2026), [Phemex analysis](https://phemex.com/blogs/bitcoin-price-analysis-august-2026), [BeInCrypto](https://beincrypto.com/bitcoin-price-prediction-august-2026/)
