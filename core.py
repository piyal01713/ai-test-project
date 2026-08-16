"""
core.py - Backend Network Operations (Mock Implementation)

This module provides a mock implementation of the backend network operations for the Lynk project.
It uses background threads to simulate file transfers, allowing the frontend GUI to be built
and tested without blocking the main event loop.
"""

import threading
import time
from typing import List, Dict, Any

class TransferManager:
    """Manages state and threading for mock file transfers."""
    
    def __init__(self):
        self.transfers = {}
        self._next_id = 1
        self._lock = threading.Lock()

    def start_sender(self, port: int, files: List[str]) -> int:
        """
        Starts a mock sender server on the given port to serve the provided files.
        """
        with self._lock:
            transfer_id = self._next_id
            self._next_id += 1
            
            self.transfers[transfer_id] = {
                "type": "send",
                "status": "waiting",
                "progress": 0.0,
                "speed": "0 KB/s",
                "eta": "Unknown",
                "message": f"Waiting for receiver on port {port}...",
                "files": files,
                "port": port
            }
            
        thread = threading.Thread(target=self._mock_transfer_process, args=(transfer_id,), daemon=True)
        thread.start()
        
        return transfer_id

    def connect_receiver(self, ip: str, port: int, dest_folder: str) -> int:
        """
        Connects to a mock sender at the given IP and port, saving files to dest_folder.
        """
        with self._lock:
            transfer_id = self._next_id
            self._next_id += 1
            
            self.transfers[transfer_id] = {
                "type": "receive",
                "status": "connecting",
                "progress": 0.0,
                "speed": "0 KB/s",
                "eta": "Unknown",
                "message": f"Connecting to {ip}:{port}...",
                "dest_folder": dest_folder,
                "ip": ip,
                "port": port
            }
            
        thread = threading.Thread(target=self._mock_transfer_process, args=(transfer_id,), daemon=True)
        thread.start()
        
        return transfer_id

    def get_status(self, transfer_id: int) -> Dict[str, Any]:
        """
        Returns a copy of the current status of the specified transfer.
        """
        with self._lock:
            if transfer_id not in self.transfers:
                return {"status": "not_found", "message": "Invalid transfer ID."}
            return self.transfers[transfer_id].copy()

    def cancel_transfer(self, transfer_id: int):
        """
        Cancels an ongoing transfer.
        """
        with self._lock:
            if transfer_id in self.transfers and self.transfers[transfer_id]["status"] in ["waiting", "connecting", "transferring"]:
                self.transfers[transfer_id]["status"] = "cancelled"
                self.transfers[transfer_id]["message"] = "Transfer cancelled."

    def _mock_transfer_process(self, transfer_id: int):
        """
        Simulates a file transfer progressing over time in a background thread.
        """
        # Simulate initial connection / setup delay
        time.sleep(1.5)  
        
        with self._lock:
            if self.transfers[transfer_id]["status"] == "cancelled":
                return
            self.transfers[transfer_id]["status"] = "transferring"
            self.transfers[transfer_id]["message"] = "Transfer in progress..."
            
        total_steps = 100
        for step in range(1, total_steps + 1):
            time.sleep(0.1)  # Simulate transferring a chunk of data
            
            with self._lock:
                if self.transfers[transfer_id]["status"] == "cancelled":
                    return
                
                # Update progress
                self.transfers[transfer_id]["progress"] = float(step)
                
                # Simulate varying speed (between 10.5 and 15.0 MB/s)
                speed_mb = 10.5 + (step % 10) * 0.5
                self.transfers[transfer_id]["speed"] = f"{speed_mb:.1f} MB/s"
                
                # Update ETA
                remaining = total_steps - step
                self.transfers[transfer_id]["eta"] = f"{remaining // 10}s"
                
        with self._lock:
            if self.transfers[transfer_id]["status"] != "cancelled":
                self.transfers[transfer_id]["status"] = "completed"
                self.transfers[transfer_id]["progress"] = 100.0
                self.transfers[transfer_id]["speed"] = "0 MB/s"
                self.transfers[transfer_id]["eta"] = "0s"
                self.transfers[transfer_id]["message"] = "Transfer completed successfully."


# Instantiate a global manager for easy module-level use
_manager = TransferManager()

def start_sender(port: int, files: List[str]) -> int:
    """
    Starts a mock sender server that listens for a connection.
    
    Args:
        port (int): The port to listen on.
        files (List[str]): A list of file paths to send.
        
    Returns:
        int: A unique transfer_id to track the operation.
    """
    return _manager.start_sender(port, files)

def connect_receiver(ip: str, port: int, dest_folder: str) -> int:
    """
    Connects to a mock sender to receive files.
    
    Args:
        ip (str): The sender's IP address.
        port (int): The sender's port.
        dest_folder (str): The directory where received files will be saved.
        
    Returns:
        int: A unique transfer_id to track the operation.
    """
    return _manager.connect_receiver(ip, port, dest_folder)

def get_transfer_status(transfer_id: int) -> Dict[str, Any]:
    """
    Gets the current status of an ongoing or completed transfer.
    
    Args:
        transfer_id (int): The ID of the transfer.
        
    Returns:
        Dict[str, Any]: A dictionary containing:
            - type (str): 'send' or 'receive'
            - status (str): 'waiting', 'connecting', 'transferring', 'completed', 'cancelled', 'not_found'
            - progress (float): 0.0 to 100.0 (percentage)
            - speed (str): Formatting string like '12.5 MB/s'
            - eta (str): Formatted string like '5s'
            - message (str): Human-readable status message
    """
    return _manager.get_status(transfer_id)

def cancel_transfer(transfer_id: int):
    """
    Cancels an ongoing transfer.
    
    Args:
        transfer_id (int): The ID of the transfer to cancel.
    """
    _manager.cancel_transfer(transfer_id)
