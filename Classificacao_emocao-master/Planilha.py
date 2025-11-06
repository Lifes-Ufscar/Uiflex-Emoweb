
import xlsxwriter
import time

class Amostra():
    usuario = None
    sessao_id = None
    workbook = None
    planilha = None
    filme = None
    linha = 0

    def __init__(self, usuario, sessao_id, filme_id):
        self.usuario = usuario
        self.sessao_id = sessao_id
        self.filme_id = filme_id

        self.workbook = xlsxwriter.Workbook("amostras/amostra_" + self.usuario + "_" + self.sessao_id + "_" + self.filme_id + ".xlsx")
        #self.workbook = xlsxwriter.Workbook("amostras/amostra_" + self.usuario + "_" + self.sessao_id + ".xlsx")
        self.planilha = self.workbook.add_worksheet()
        bold = self.workbook.add_format({'bold': True})

        self.planilha.write('A1',  'Contador',       bold)
        self.planilha.write('A2',  'Atencao',        bold)
        self.planilha.write('A3',  'Meditacao',      bold)
        self.planilha.write('A4',  'Raw Value',      bold)
        self.planilha.write('A5',  'Delta',          bold)
        self.planilha.write('A6',  'Theta',          bold)
        self.planilha.write('A7',  'Low Alpha',      bold)
        self.planilha.write('A8',  'High Alpha',     bold)
        self.planilha.write('A9',  'Low Beta',       bold)
        self.planilha.write('A10', 'High Beta',      bold)
        self.planilha.write('A11', 'Low Gamma',      bold)
        self.planilha.write('A12', 'Mid Gamma',      bold)
        self.planilha.write('A13', 'Poor Signal',    bold)
        self.planilha.write('A14', 'Blink Strength', bold)
        self.planilha.write('A15', 'GSR',            bold)
        self.planilha.write('A16', 'ECG',            bold)
        self.planilha.write('A17', 'Tempo',          bold)

        print("- Planilha " + "amostra_" + self.usuario + "_" + self.sessao_id + "_" + self.filme_id + ".xlsx" + " criada com sucesso\n")
        time.sleep(1)

    def escrita_xlsx(self, coluna, contador, mindwave, gsr, ecg, tempo):
        # Escrita dos sinais fisiologicos na planilha
        self.planilha.write(self.linha,      coluna, contador)
        self.planilha.write(self.linha + 1,  coluna, mindwave.attention)
        self.planilha.write(self.linha + 2,  coluna, mindwave.meditation)
        self.planilha.write(self.linha + 3,  coluna, mindwave.rawValue)
        self.planilha.write(self.linha + 4,  coluna, mindwave.delta)
        self.planilha.write(self.linha + 5,  coluna, mindwave.theta)
        self.planilha.write(self.linha + 6,  coluna, mindwave.lowAlpha)
        self.planilha.write(self.linha + 7,  coluna, mindwave.highAlpha)
        self.planilha.write(self.linha + 8,  coluna, mindwave.lowBeta)
        self.planilha.write(self.linha + 9,  coluna, mindwave.highBeta)
        self.planilha.write(self.linha + 10, coluna, mindwave.lowGamma)
        self.planilha.write(self.linha + 11, coluna, mindwave.midGamma)
        self.planilha.write(self.linha + 12, coluna, mindwave.poorSignal)
        self.planilha.write(self.linha + 13, coluna, mindwave.blinkStrength)
        self.planilha.write(self.linha + 14, coluna, gsr)
        self.planilha.write(self.linha + 15, coluna, ecg)
        self.planilha.write(self.linha + 16, coluna, tempo)

    def fecha_xlsx(self):
        self.workbook.close()
