# Velyon AI Classification Taxonomy

Reference document for the AI Classification system used across the Portfolio Scanner and Velyon.io website.

---

## Primary AI Category (multi-select)

Most projects use multiple categories. Select all that apply.

| ID | Category | Description | Examples |
|---|---|---|---|
| `agentic-ai` | Agentic AI | Autonomous agents that plan, reason, use tools, and take multi-step actions toward a goal | Multi-agent orchestrators, tool-calling agents, autonomous research agents, self-healing systems |
| `generative-ai` | Generative AI | Creating new content — text, images, video, audio, code, 3D | LLM content gen, image generation, video synthesis, code assistants, voice cloning |
| `predictive-ai` | Predictive AI | Forecasting future outcomes from historical/pattern data | Churn prediction, demand forecasting, lead scoring, risk assessment, time-series forecasting |
| `computer-vision` | Computer Vision | Understanding and processing visual data — images, video, diagrams | Object detection, OCR, image classification, facial recognition, video analysis, document scanning |
| `nlp` | NLP / Language Understanding | Extracting meaning, intent, and structure from text | Sentiment analysis, entity extraction, text classification, summarisation, translation, semantic search |
| `recommendation` | Recommendation & Personalisation | Ranking, surfacing, or personalising content/products for a user | Product recommendations, content ranking, personalised feeds, collaborative filtering |
| `anomaly-detection` | Anomaly & Fraud Detection | Identifying unusual patterns, outliers, or suspicious behaviour | Fraud detection, system monitoring, intrusion detection, quality control, outlier analysis |
| `speech-audio` | Speech & Audio AI | Processing, generating, or understanding audio/speech | Speech-to-text, text-to-speech, speaker diarisation, audio classification, real-time transcription |
| `custom-models` | Custom / Fine-Tuned Models | Models trained or fine-tuned from scratch on domain-specific data, not off-the-shelf | Custom LLMs, domain-specific classifiers, specialised embedding models, fine-tuned diffusion models |
| `data-mlops` | Data Engineering & ML Ops | The infrastructure and pipelines that make AI systems work in production | Feature stores, data pipelines, model registries, A/B testing, monitoring, drift detection |
| `edge-ai` | Embedded / Edge AI | AI running on-device or at the edge, not in the cloud | On-device inference, IoT AI, mobile ML, real-time edge processing |
| `knowledge-reasoning` | Knowledge & Reasoning | Structured knowledge representation, logic, graph-based reasoning | Knowledge graphs, ontology systems, rule engines, causal reasoning, graph RAG |

---

## Architecture Pattern (single-select)

| ID | Pattern | Description | When to use |
|---|---|---|---|
| `multi-agent` | Multi-Agent System | Multiple specialised agents collaborating under an orchestrator | Complex tasks requiring different expertise areas working together |
| `rag-pipeline` | RAG Pipeline | Retrieval-augmented generation — vector/keyword search feeds context into an LLM | Answering questions from a private knowledge base |
| `single-agent-tools` | Single Agent + Tools | One LLM-based agent with access to external tools/APIs | Task automation, workflow agents, personal assistants |
| `model-pipeline` | Model Pipeline | Sequential chain of models — preprocessing → model → postprocessing | End-to-end processing (e.g. extract → classify → route) |
| `fine-tuned-model` | Fine-Tuned Model | Custom-trained model with inference serving wrapper | Domain-specific tasks where general models fall short |
| `api-orchestration` | API Orchestration | Multiple external AI APIs stitched together — no custom model | Rapid prototyping, combining best-of-breed services |
| `real-time-streaming` | Real-Time Streaming | Low-latency streaming inference (SSE, WebSockets) | Chat interfaces, live dashboards, real-time monitoring |
| `batch-processing` | Batch Processing | Scheduled offline model runs on bulk data | Nightly reports, bulk classification, training jobs |
| `hybrid-complex` | Hybrid / Complex | Doesn't fit a single pattern — combination of multiple approaches | Large systems with multiple subsystems |

---

## Models & Services Used (tag field — freeform)

Suggested tags:

| Tag | Type |
|---|---|
| Claude Opus 4 | LLM |
| Claude Sonnet 5 | LLM |
| Claude Fable 5 | LLM |
| GPT-4o | LLM |
| GPT-4o-mini | LLM |
| Gemini 2.5 Pro | LLM |
| Gemini 2.5 Flash | LLM |
| Llama 3 (fine-tuned) | Custom Model |
| Whisper | Speech |
| Turbo | Speech |
| DALL-E 3 | Image Gen |
| Midjourney | Image Gen |
| YOLO | Vision |
| EfficientDet | Vision |
| OpenAI Embeddings (text-embedding-3) | Embeddings |
| Pinecone | Vector DB |
| Weaviate | Vector DB |
| Qdrant | Vector DB |
| Supabase pgvector | Vector DB |
| Hugging Face Transformers | Framework |
| LangChain | Framework |
| LangGraph | Framework |
| CrewAI | Agent Framework |
| AutoGen | Agent Framework |
| custom-finetuned | Custom |
| ElevenLabs | Voice |
| HeyGen | Video |
| Higgsfield | Video |

(Plus any others — this is a freeform tag field.)

---

## Autonomy Level (single-select)

| ID | Level | Description |
|---|---|---|
| `fully-autonomous` | Fully Autonomous | Runs end-to-end with no human in the loop — makes its own decisions and acts |
| `human-in-the-loop` | Human-in-the-Loop | AI proposes, human reviews and approves before action is taken |
| `human-approval-required` | Human-Approval-Required | AI does all the work, but a human must explicitly approve the output before it's published/sent |
| `advisory-only` | Advisory Only | AI provides recommendations/suggestions, human does all the actual work |

---

## Key AI Methodology (tag field — freeform)

Suggested tags:

| Tag | What it is |
|---|---|
| Chain-of-Thought (CoT) | Step-by-step reasoning before answering |
| Validator Loop | AI generates → second AI validates → retry if invalid |
| Synthetic Data Generation | Creating training/evaluation data with AI |
| Few-Shot Prompting | Providing examples in the prompt to guide output |
| DPO / RLHF Fine-Tuning | Training models on human preference data |
| MCTS / Tree-of-Thought | Exploring multiple reasoning paths before committing |
| Structured Output (JSON mode) | Forcing LLM output into a defined schema |
| Multi-Modal Fusion | Combining text + image + audio in a single pipeline |
| Knowledge Graph + LLM | Combining structured graph reasoning with generative AI |
| Embedding + Reranking | Two-stage retrieval — semantic search then precision reranking |
| Prompt Chaining | Multiple sequential prompts where output of one feeds the next |
| Self-Healing / Self-Correcting | System detects its own errors and retries with fixes |
| Streaming SSE Architecture | Real-time server-sent events for live AI output |
| Edge / On-Device Inference | Running models locally without cloud dependency |

(Plus any others — freeform tag field.)
