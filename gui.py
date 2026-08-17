import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from tkinter.scrolledtext import ScrolledText
import threading
import time
import os

try:
    import core
except ImportError:
    # Fallback/Mock core module if not present yet
    class MockCore:
        def start_server(self, ip, port, filepath, callback):
            callback("Status: Starting server...")
            time.sleep(1)
            callback(f"Status: Listening on {ip}:{port}")
            time.sleep(2)
            callback("Status: Client connected. Sending file...")
            for i in range(1, 101, 5):
                callback(f"PROGRESS:{i}:2.5 MB/s:00:15")
                time.sleep(0.2)
            callback("Status: Transfer complete!")
            
        def start_client(self, ip, port, dest_folder, callback):
            callback(f"Status: Connecting to {ip}:{port}...")
            time.sleep(1)
            callback("Status: Connected! Receiving file...")
            for i in range(1, 101, 5):
                callback(f"PROGRESS:{i}:2.5 MB/s:00:15")
                time.sleep(0.2)
            callback(f"Status: Transfer complete! Saved to {dest_folder}")

    core = MockCore()


class LynkApp(tk.Tk):
    def __init__(self):
        super().__init__()

        self.title("Lynk - File Transfer")
        self.geometry("650x550")
        self.minsize(550, 500)

        self.setup_styles()
        self.create_widgets()

    def setup_styles(self):
        self.style = ttk.Style(self)
        # Use 'clam' theme as it looks better across platforms
        if 'clam' in self.style.theme_names():
            self.style.theme_use('clam')
            
        bg_color = "#f8f9fa"
        primary_color = "#0d6efd"
        text_color = "#212529"
        
        base_font = ("Segoe UI", 10)
        header_font = ("Segoe UI", 14, "bold")
        
        self.configure(background=bg_color)
        
        self.style.configure("TFrame", background=bg_color)
        self.style.configure("TLabel", background=bg_color, foreground=text_color, font=base_font)
        self.style.configure("Header.TLabel", background=bg_color, foreground=primary_color, font=header_font)
        self.style.configure("SubHeader.TLabel", background=bg_color, foreground=text_color, font=("Segoe UI", 11, "bold"))
        
        self.style.configure("TButton", font=base_font, padding=6)
        self.style.configure("Primary.TButton", font=("Segoe UI", 10, "bold"), background=primary_color, foreground="white", padding=6)
        self.style.map("Primary.TButton", background=[("active", "#0b5ed7")])

        self.style.configure("TEntry", fieldbackground="#ffffff", padding=5, font=base_font)
        self.style.configure("TRadiobutton", background=bg_color, font=base_font)
        
        self.style.configure("Horizontal.TProgressbar", background=primary_color)

    def create_widgets(self):
        # --- Top Mode Selection ---
        self.mode_frame = ttk.Frame(self, padding=(20, 15, 20, 5))
        self.mode_frame.pack(fill=tk.X)

        self.mode_var = tk.StringVar(value="sender")
        
        ttk.Label(self.mode_frame, text="Select Mode:", style="SubHeader.TLabel").pack(side=tk.LEFT, padx=(0, 15))
        ttk.Radiobutton(self.mode_frame, text="Host File (Sender)", variable=self.mode_var, value="sender", command=self.switch_mode).pack(side=tk.LEFT, padx=10)
        ttk.Radiobutton(self.mode_frame, text="Connect (Receiver)", variable=self.mode_var, value="receiver", command=self.switch_mode).pack(side=tk.LEFT, padx=10)

        # --- Separator ---
        ttk.Separator(self, orient="horizontal").pack(fill=tk.X, padx=20, pady=10)

        # --- Dynamic Content Frame ---
        self.content_frame = ttk.Frame(self, padding=(20, 5))
        self.content_frame.pack(fill=tk.X)

        # Sender Frame
        self.sender_frame = ttk.Frame(self.content_frame)
        self.build_sender_frame()

        # Receiver Frame
        self.receiver_frame = ttk.Frame(self.content_frame)
        self.build_receiver_frame()

        # --- Separator ---
        ttk.Separator(self, orient="horizontal").pack(fill=tk.X, padx=20, pady=10)

        # --- Status & Progress Frame ---
        self.status_frame = ttk.Frame(self, padding=(20, 5, 20, 20))
        self.status_frame.pack(fill=tk.BOTH, expand=True)
        self.build_status_frame()

        # Initialize UI state
        self.switch_mode()

    def build_sender_frame(self):
        ttk.Label(self.sender_frame, text="Network Configuration", style="Header.TLabel").grid(row=0, column=0, columnspan=4, sticky=tk.W, pady=(0, 15))

        ttk.Label(self.sender_frame, text="Host IP:").grid(row=1, column=0, sticky=tk.W, pady=8)
        self.sender_ip = ttk.Entry(self.sender_frame, width=22)
        self.sender_ip.insert(0, "0.0.0.0")
        self.sender_ip.grid(row=1, column=1, sticky=tk.W, pady=8, padx=(5, 20))

        ttk.Label(self.sender_frame, text="Port:").grid(row=1, column=2, sticky=tk.W, pady=8)
        self.sender_port = ttk.Entry(self.sender_frame, width=12)
        self.sender_port.insert(0, "8080")
        self.sender_port.grid(row=1, column=3, sticky=tk.W, pady=8, padx=5)

        ttk.Label(self.sender_frame, text="File to Send:").grid(row=2, column=0, sticky=tk.W, pady=8)
        self.sender_filepath = tk.StringVar()
        self.sender_entry = ttk.Entry(self.sender_frame, textvariable=self.sender_filepath, width=45)
        self.sender_entry.grid(row=2, column=1, columnspan=3, sticky=tk.WE, pady=8, padx=(5, 10))
        
        ttk.Button(self.sender_frame, text="Browse", command=self.browse_file).grid(row=2, column=4, sticky=tk.W, pady=8)

        ttk.Button(self.sender_frame, text="Start Hosting", style="Primary.TButton", command=self.start_hosting).grid(row=3, column=0, columnspan=5, pady=(20, 0), sticky=tk.EW)
        
        self.sender_frame.columnconfigure(1, weight=1)
        self.sender_frame.columnconfigure(2, weight=0)
        self.sender_frame.columnconfigure(3, weight=1)

    def build_receiver_frame(self):
        ttk.Label(self.receiver_frame, text="Network Configuration", style="Header.TLabel").grid(row=0, column=0, columnspan=4, sticky=tk.W, pady=(0, 15))

        ttk.Label(self.receiver_frame, text="Host IP:").grid(row=1, column=0, sticky=tk.W, pady=8)
        self.receiver_ip = ttk.Entry(self.receiver_frame, width=22)
        self.receiver_ip.insert(0, "127.0.0.1")
        self.receiver_ip.grid(row=1, column=1, sticky=tk.W, pady=8, padx=(5, 20))

        ttk.Label(self.receiver_frame, text="Port:").grid(row=1, column=2, sticky=tk.W, pady=8)
        self.receiver_port = ttk.Entry(self.receiver_frame, width=12)
        self.receiver_port.insert(0, "8080")
        self.receiver_port.grid(row=1, column=3, sticky=tk.W, pady=8, padx=5)

        ttk.Label(self.receiver_frame, text="Save To:").grid(row=2, column=0, sticky=tk.W, pady=8)
        self.receiver_folder = tk.StringVar()
        self.receiver_entry = ttk.Entry(self.receiver_frame, textvariable=self.receiver_folder, width=45)
        self.receiver_entry.grid(row=2, column=1, columnspan=3, sticky=tk.WE, pady=8, padx=(5, 10))
        
        ttk.Button(self.receiver_frame, text="Browse", command=self.browse_folder).grid(row=2, column=4, sticky=tk.W, pady=8)

        ttk.Button(self.receiver_frame, text="Connect & Receive", style="Primary.TButton", command=self.start_receiving).grid(row=3, column=0, columnspan=5, pady=(20, 0), sticky=tk.EW)
        
        self.receiver_frame.columnconfigure(1, weight=1)
        self.receiver_frame.columnconfigure(2, weight=0)
        self.receiver_frame.columnconfigure(3, weight=1)

    def build_status_frame(self):
        ttk.Label(self.status_frame, text="Transfer Status", style="Header.TLabel").pack(anchor=tk.W, pady=(0, 10))

        self.status_lbl = ttk.Label(self.status_frame, text="Status: Idle", font=("Segoe UI", 10, "italic"))
        self.status_lbl.pack(anchor=tk.W, pady=2)

        self.progress_var = tk.DoubleVar()
        self.progress_bar = ttk.Progressbar(self.status_frame, variable=self.progress_var, maximum=100, length=400, mode="determinate", style="Horizontal.TProgressbar")
        self.progress_bar.pack(fill=tk.X, pady=(10, 5))

        # Frame for Speed and ETA
        stats_frame = ttk.Frame(self.status_frame)
        stats_frame.pack(fill=tk.X, pady=(0, 10))
        
        self.speed_lbl = ttk.Label(stats_frame, text="Speed: --", font=("Segoe UI", 9))
        self.speed_lbl.pack(side=tk.LEFT)
        
        self.eta_lbl = ttk.Label(stats_frame, text="ETA: --", font=("Segoe UI", 9))
        self.eta_lbl.pack(side=tk.RIGHT)

        ttk.Label(self.status_frame, text="Log:", style="SubHeader.TLabel").pack(anchor=tk.W, pady=(10, 5))
        self.log_text = ScrolledText(
            self.status_frame, height=8, state=tk.DISABLED, 
            font=("Consolas", 9), bg="#ffffff", fg="#212529", 
            relief=tk.FLAT, borderwidth=1, highlightthickness=1, 
            highlightbackground="#dee2e6", highlightcolor="#0d6efd"
        )
        self.log_text.pack(fill=tk.BOTH, expand=True)

    def switch_mode(self):
        if self.mode_var.get() == "sender":
            self.receiver_frame.pack_forget()
            self.sender_frame.pack(fill=tk.BOTH, expand=True)
        else:
            self.sender_frame.pack_forget()
            self.receiver_frame.pack(fill=tk.BOTH, expand=True)
            
    def browse_file(self):
        filepath = filedialog.askopenfilename(title="Select File to Send")
        if filepath:
            self.sender_filepath.set(filepath)
            
    def browse_folder(self):
        folder = filedialog.askdirectory(title="Select Destination Folder")
        if folder:
            self.receiver_folder.set(folder)

    def log_message(self, message):
        # Use after to ensure thread safety
        self.after(0, self._append_log, message)
        
    def _append_log(self, message):
        self.log_text.config(state=tk.NORMAL)
        self.log_text.insert(tk.END, message + "\n")
        self.log_text.see(tk.END)
        self.log_text.config(state=tk.DISABLED)

    def update_progress(self, percent, speed, eta):
        self.after(0, self._set_progress, percent, speed, eta)
        
    def _set_progress(self, percent, speed, eta):
        self.progress_var.set(percent)
        self.speed_lbl.config(text=f"Speed: {speed}")
        self.eta_lbl.config(text=f"ETA: {eta}")

    def update_status(self, text):
        self.after(0, lambda: self.status_lbl.config(text=text))

    def handle_core_callback(self, data):
        """Callback function to handle messages from the core module"""
        if data.startswith("PROGRESS:"):
            # Format expected: PROGRESS:percent:speed:eta
            parts = data.split(":")
            if len(parts) >= 4:
                try:
                    percent = float(parts[1])
                    speed = parts[2]
                    eta = parts[3]
                    self.update_progress(percent, speed, eta)
                except ValueError:
                    pass
        elif data.startswith("Status:"):
            self.update_status(data)
            self.log_message(data[7:].strip())
        else:
            self.log_message(data)

    def start_hosting(self):
        ip = self.sender_ip.get().strip()
        port = self.sender_port.get().strip()
        filepath = self.sender_filepath.get().strip()
        
        if not filepath or not os.path.isfile(filepath):
            messagebox.showerror("Error", "Please select a valid file to send.")
            return
        if not port.isdigit():
            messagebox.showerror("Error", "Port must be a valid number.")
            return
            
        self.log_message("--- Starting Sender Mode ---")
        self.progress_var.set(0)
        self.update_progress(0, "--", "--")
        
        # Run backend operation in a separate thread to keep GUI responsive
        def run_task():
            try:
                core.start_server(ip, int(port), filepath, self.handle_core_callback)
            except Exception as e:
                self.log_message(f"Error: {e}")
                self.update_status("Status: Error occurred")
                
        threading.Thread(target=run_task, daemon=True).start()

    def start_receiving(self):
        ip = self.receiver_ip.get().strip()
        port = self.receiver_port.get().strip()
        folder = self.receiver_folder.get().strip()
        
        if not folder or not os.path.isdir(folder):
            messagebox.showerror("Error", "Please select a valid destination folder.")
            return
        if not port.isdigit():
            messagebox.showerror("Error", "Port must be a valid number.")
            return
            
        self.log_message("--- Starting Receiver Mode ---")
        self.progress_var.set(0)
        self.update_progress(0, "--", "--")
        
        # Run backend operation in a separate thread to keep GUI responsive
        def run_task():
            try:
                core.start_client(ip, int(port), folder, self.handle_core_callback)
            except Exception as e:
                self.log_message(f"Error: {e}")
                self.update_status("Status: Error occurred")
                
        threading.Thread(target=run_task, daemon=True).start()


if __name__ == "__main__":
    app = LynkApp()
    app.mainloop()
