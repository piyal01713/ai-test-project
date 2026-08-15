# Lynk: Product Overview

## Core Features
  
* **Resilient & Auto-Resume:** Designed to handle network drops (like unstable Wi-Fi). If the connection is lost, it automatically attempts to reconnect with an exponential backoff. It uses a hidden progress file (`.lynk_progress`) to track completed chunks so you can manually resume a canceled transfer later by just running the command again.
* **Chunk-Based Streaming:** Files are split into configurable chunks (defaulting to 4 MB) and transferred independently. This allows for streaming without ever loading the full file into your system's memory.
* **Data Integrity:** Ensures your file isn't corrupted during transfer by generating and verifying cryptographic hashes (checksums) for each individual chunk as it arrives, as well as a final full-file hash when the transfer completes. Corrupted chunks are automatically re-requested.
* **Cross-Platform:** Designed to work interchangeably across Zorin OS (Linux), Windows, and macOS—anywhere Python 3 runs.
* **Low Dependencies:** The application is highly portable, largely relying on the standard Python 3 library (with a possible requirement for the `blake3` pip package, depending on your hash implementation).
* **LAN-Only Privacy:** All file traffic stays strictly within your local network. No data is sent out to the broader internet.
* **Clean CLI Interface:** Provides clear terminal output, including a live progress bar, transfer speeds (e.g., MB/s), and estimated time of arrival (ETA), without the overhead of a graphical user interface.

## Usage

To use it, the "sender" runs a command to host the file on a specific port, and the "receiver" connects to the sender's local IP address to seamlessly pull the file over.
