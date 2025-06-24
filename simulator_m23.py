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
        self.alarm_active = False

        root.geometry("600x400")

        tk.Button(root, text="Opreste Tot (S0)", command=self.stop_all).grid(row=0, column=0, sticky="w")
        tk.Button(root, text="Opreste doar intrare (S5)", command=self.stop_input_bands).grid(row=0, column=1, sticky="w")
        tk.Label(root, text="Pozitie Clapeta:").grid(row=1, column=0, sticky="w")
        self.clapeta = ttk.Combobox(root, values=["S6 - Stanga", "S7 - Mijloc", "S8 - Dreapta"])
        self.clapeta.grid(row=1, column=1)
        self.clapeta.current(1)

        self.sensor1 = tk.IntVar()
        self.sensor2 = tk.IntVar()
        tk.Checkbutton(root, text="Senzor 1 activ", variable=self.sensor1, command=self.check_alarm).grid(row=2, column=0, sticky="w")
        tk.Checkbutton(root, text="Senzor 2 activ", variable=self.sensor2, command=self.check_alarm).grid(row=3, column=0, sticky="w")

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

        tk.Button(root, text="Porneste P1", command=self.toggle_p1).grid(row=0, column=3, sticky="w")
        tk.Button(root, text="Porneste P2", command=self.toggle_p2).grid(row=1, column=3, sticky="w")
        tk.Button(root, text="Porneste P3", command=self.toggle_p3).grid(row=2, column=3, sticky="w")
        tk.Button(root, text="Porneste P4", command=self.toggle_p4).grid(row=3, column=3, sticky="w")
        tk.Button(root, text="Porneste ambele benzi intrare (S7)", command=self.start_both_input_bands_s7).grid(row=4, column=3, sticky="w")

    def start_band1(self):
        if self.alarm_active:
            return
        position = self.clapeta.get()
        if position == "S6 - Stanga" and self.status["P3"].cget("fg") != "green":
            messagebox.showwarning("Eroare", "P3 trebuie să fie activă pentru a porni Banda 1!")
            return
        if position == "S8 - Dreapta" and self.status["P4"].cget("fg") != "green":
            messagebox.showwarning("Eroare", "P4 trebuie să fie activă pentru a porni Banda 1!")
            return
        if position == "S7 - Mijloc" and (self.status["P3"].cget("fg") != "green" or self.status["P4"].cget("fg") != "green"):
            messagebox.showwarning("Eroare", "P3 și P4 trebuie să fie active pentru a porni Banda 1 cu clapeta pe mijloc!")
            return
        if self.band2_on and not (position == "S7 - Mijloc" and self.status["P3"].cget("fg") == "green" and self.status["P4"].cget("fg") == "green"):
            messagebox.showwarning("Eroare", "Nu poți porni Banda 1 cât timp Banda 2 este activă!")
            return
        if self.sensor1.get() and self.sensor2.get():
            self.trigger_alarm()
            return
        self.band1_on = True
        self.status["P1"].config(fg="green")
        self.update_output_band()
        self.send_update_to_server(self.get_current_state())

    def start_band2(self):
        if self.alarm_active:
            return
        position = self.clapeta.get()
        if position == "S6 - Stanga" and self.status["P3"].cget("fg") != "green":
            messagebox.showwarning("Eroare", "P3 trebuie să fie activă pentru a porni Banda 2!")
            return
        if position == "S8 - Dreapta" and self.status["P4"].cget("fg") != "green":
            messagebox.showwarning("Eroare", "P4 trebuie să fie activă pentru a porni Banda 2!")
            return
        if position == "S7 - Mijloc" and (self.status["P3"].cget("fg") != "green" or self.status["P4"].cget("fg") != "green"):
            messagebox.showwarning("Eroare", "P3 și P4 trebuie să fie active pentru a porni Banda 2 cu clapeta pe mijloc!")
            return
        if self.band1_on and not (position == "S7 - Mijloc" and self.status["P3"].cget("fg") == "green" and self.status["P4"].cget("fg") == "green"):
            messagebox.showwarning("Eroare", "Nu poți porni Banda 2 cât timp Banda 1 este activă!")
            return
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
        self.alarm_active = False
        self.send_update_to_server(self.get_current_state())

    def stop_input_bands(self):
        self.band1_on = False
        self.band2_on = False
        self.status["P1"].config(fg="gray")
        self.status["P2"].config(fg="gray")
        self.send_update_to_server(self.get_current_state())

    def update_output_band(self):
        pass

    def check_alarm(self):
        if self.sensor1.get() and self.sensor2.get():
            self.trigger_alarm()
        else:
            self.send_update_to_server(self.get_current_state())

    def trigger_alarm(self):
        if self.alarm_active:
            return
        self.alarm_active = True
        self.stop_all()
        self.status["ALARMA"].grid()
        self.send_update_to_server(self.get_current_state())
        self.root.after(5000, self.reset_alarm)

    def reset_alarm(self):
        self.status["ALARMA"].grid_remove()
        self.alarm_active = False
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

    def toggle_p1(self):
        if self.alarm_active:
            return
        if not self.band1_on and self.band2_on:
            messagebox.showwarning("Eroare", "Nu poți porni Banda 1 cât timp Banda 2 este activă!")
            return
        position = self.clapeta.get()
        if not self.band1_on:
            if position == "S6 - Stanga" and self.status["P3"].cget("fg") != "green":
                messagebox.showwarning("Eroare", "P3 trebuie să fie activă pentru a porni Banda 1!")
                return
            if position == "S8 - Dreapta" and self.status["P4"].cget("fg") != "green":
                messagebox.showwarning("Eroare", "P4 trebuie să fie activă pentru a porni Banda 1!")
                return
            if position == "S7 - Mijloc" and (self.status["P3"].cget("fg") != "green" or self.status["P4"].cget("fg") != "green"):
                messagebox.showwarning("Eroare", "P3 și P4 trebuie să fie active pentru a porni Banda 1 cu clapeta pe mijloc!")
                return
        self.band1_on = not self.band1_on
        self.status["P1"].config(fg="green" if self.band1_on else "gray")
        self.update_output_band()
        self.send_update_to_server(self.get_current_state())

    def toggle_p2(self):
        if self.alarm_active:
            return
        if not self.band2_on and self.band1_on:
            messagebox.showwarning("Eroare", "Nu poți porni Banda 2 cât timp Banda 1 este activă!")
            return
        position = self.clapeta.get()
        if not self.band2_on:
            if position == "S6 - Stanga" and self.status["P3"].cget("fg") != "green":
                messagebox.showwarning("Eroare", "P3 trebuie să fie activă pentru a porni Banda 2!")
                return
            if position == "S8 - Dreapta" and self.status["P4"].cget("fg") != "green":
                messagebox.showwarning("Eroare", "P4 trebuie să fie activă pentru a porni Banda 2!")
                return
            if position == "S7 - Mijloc" and (self.status["P3"].cget("fg") != "green" or self.status["P4"].cget("fg") != "green"):
                messagebox.showwarning("Eroare", "P3 și P4 trebuie să fie active pentru a porni Banda 2 cu clapeta pe mijloc!")
                return
        self.band2_on = not self.band2_on
        self.status["P2"].config(fg="green" if self.band2_on else "gray")
        self.update_output_band()
        self.send_update_to_server(self.get_current_state())

    def toggle_p3(self):
        current = self.status["P3"].cget("fg") == "green"
        self.status["P3"].config(fg="gray" if current else "green")
        self.send_update_to_server(self.get_current_state())

    def toggle_p4(self):
        current = self.status["P4"].cget("fg") == "green"
        self.status["P4"].config(fg="gray" if current else "green")
        self.send_update_to_server(self.get_current_state())

    def start_both_input_bands_s7(self):
        if self.alarm_active:
            return
        if self.clapeta.get() != "S7 - Mijloc":
            messagebox.showwarning("Eroare", "Clapeta trebuie să fie pe S7 (Mijloc)!")
            return
        if not (self.status["P3"].cget("fg") == "green" and self.status["P4"].cget("fg") == "green"):
            messagebox.showwarning("Eroare", "Ambele benzi de ieșire trebuie să fie active!")
            return
        self.band1_on = True
        self.band2_on = True
        self.status["P1"].config(fg="green")
        self.status["P2"].config(fg="green")
        self.update_output_band()
        self.send_update_to_server(self.get_current_state())

if __name__ == "__main__":
    root = tk.Tk()
    app = M23Simulator(root)
    root.mainloop()