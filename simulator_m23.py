import tkinter as tk
from tkinter import ttk
from tkinter import messagebox
import socket
import json

class M23Simulator:
    def __init__(self, root):
        self.root = root
        self.root.title("Simulator Benzi M23")
        self.band1_on = False
        self.band2_on = False

        root.geometry("600x400")

        # Butoane de control
        tk.Button(root, text="Porneste Banda 1 (H1)", command=self.start_band1).grid(row=0, column=0, sticky="w")
        tk.Button(root, text="Porneste Banda 2 (H2)", command=self.start_band2).grid(row=1, column=0, sticky="w")
        tk.Button(root, text="Opreste Tot (S0)", command=self.stop_all).grid(row=2, column=0, sticky="w")

        # Clapeta (S6, S7, S8)
        tk.Label(root, text="Pozitie Clapeta:").grid(row=3, column=0, sticky="w")
        self.clapeta = ttk.Combobox(root, values=["S6 - Stanga", "S7 - Mijloc", "S8 - Dreapta"])
        self.clapeta.grid(row=3, column=1)
        self.clapeta.current(1)

        # Senzori
        self.sensor1 = tk.IntVar()
        self.sensor2 = tk.IntVar()
        tk.Checkbutton(root, text="Senzor 1 activ", variable=self.sensor1, command=self.check_alarm).grid(row=4, column=0, sticky="w")
        tk.Checkbutton(root, text="Senzor 2 activ", variable=self.sensor2, command=self.check_alarm).grid(row=5, column=0, sticky="w")

        # Status benzi
        self.status = {
            "P1": tk.Label(root, text="P1 - Banda 1", fg="gray"),
            "P2": tk.Label(root, text="P2 - Banda 2", fg="gray"),
            "P3": tk.Label(root, text="P3 - Banda 3", fg="gray"),
            "P4": tk.Label(root, text="P4 - Banda 4", fg="gray"),
            "ALARMA": tk.Label(root, text="ALARMA: Sistem oprit!", fg="red")
        }
        for i, label in enumerate(self.status.values()):
            label.grid(row=i, column=2, padx=20, sticky="w")
        self.status["ALARMA"].grid(row=6, column=2, sticky="w")
        self.status["ALARMA"].grid_remove()

    def start_band1(self):
        if self.sensor1.get() and self.sensor2.get():
            self.trigger_alarm()
            return
        self.band1_on = True
        self.status["P1"].config(fg="green")
        self.update_output_band()
        self.send_update_to_server(self.get_current_state())

    def start_band2(self):
        if self.sensor1.get() and self.sensor2.get():
            self.trigger_alarm()
            return
        self.band2_on = True
        self.status["P2"].config(fg="green")
        self.update_output_band()
        self.send_update_to_server(self.get_current_state())

    def stop_all(self):
        self.band1_on = False
        self.band2_on = False
        for key in ["P1", "P2", "P3", "P4"]:
            self.status[key].config(fg="gray")
        self.status["ALARMA"].grid_remove()
        self.send_update_to_server(self.get_current_state())

    def update_output_band(self):
        position = self.clapeta.get()
        self.status["P3"].config(fg="gray")
        self.status["P4"].config(fg="gray")
        if position == "S6 - Stanga":
            self.status["P3"].config(fg="green")
        elif position == "S7 - Mijloc":
            self.status["P3"].config(fg="green")
            self.status["P4"].config(fg="green")
        elif position == "S8 - Dreapta":
            self.status["P4"].config(fg="green")

    def check_alarm(self):
        if self.sensor1.get() and self.sensor2.get():
            self.trigger_alarm()
        else:
            self.send_update_to_server(self.get_current_state())

    def trigger_alarm(self):
        self.stop_all()
        self.status["ALARMA"].grid()
        self.send_update_to_server(self.get_current_state())

    def get_current_state(self):
        return {
            "P1": self.band1_on,
            "P2": self.band2_on,
            "P3": self.status["P3"].cget("fg") == "green",
            "P4": self.status["P4"].cget("fg") == "green",
            "clapeta": self.clapeta.get(),
            "sensor1": self.sensor1.get(),
            "sensor2": self.sensor2.get(),
            "alarm": self.status["ALARMA"].winfo_ismapped()
        }

    def send_update_to_server(self, data):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.connect(('localhost', 5000))
                s.sendall(json.dumps(data).encode('utf-8'))
                print("[Trimis spre server] =>", data)
        except Exception as e:
            print(f"[Eroare Socket] {e}")

if __name__ == "__main__":
    root = tk.Tk()
    app = M23Simulator(root)
    root.mainloop()
