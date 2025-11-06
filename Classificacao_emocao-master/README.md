<p align="center">
  <img href="https://lifes.dc.ufscar.br/" src="imagens/logo.png" alt="Laboratório de Interação Flexível e Sustentável"/>
</p>

# Captura e classificação de emoções

Códigos para captura e posterior classificação dos estados emocionais através dos sinais fisiológicos EEG, ECG e GSR.

A descrição de cada um desses sinais está logo abaixo:
* **EEG (eletroencefalograma)** mede a atividade cerebral informando a produção de ondas beta, alfa e teta;
* **ECG (eletrocardiograma)** mede a atividade elétrica do coração;
* **GSR (resposta galvânica da pele)** mede a atividade elétrica das glândulas que produzem suor nas palmas das mãos e pontas dos dedos, mais sensíveis às emoções e pensamentos.

| Sinal         | Hardware                                                                                  |
| ------------- |:-----------------------------------------------------------------------------------------:|
| EEG           | NeuroSky&copy; mindwave																	|
| ECG           | [SparkFun AD8232 Single Lead Heart Rate Monitor](https://www.sparkfun.com/products/12650) |
| GSR           |                                                                                           |

## Hardwares usados
* **SparkFun AD8232 Single Lead Heart Rate Monitor**
  * Guia: https://learn.sparkfun.com/tutorials/ad8232-heart-rate-monitor-hookup-guide
  * GitHub: https://github.com/sparkfun/AD8232_Heart_Rate_Monitor

**Quanto mais próximos os eletrodos estiverem do coração, melhor será a medição**. Os cabos são identificados por cores para ajudar a identificar o posicionamento adequado, conforme mostrado na tabela com base no triângulo de Einthoven. Os sensores podem ser colocados nos antebraços e na perna, ou elas podem ser colocadas no peito perto dos braços e acima do abdome inferior direito (ou seja, logo acima do quadril direito), como mostrado no diagrama abaixo.

<p align="center">
  <img href="https://lifes.dc.ufscar.br/" src="imagens/sparkfun.png" alt="Retirado em: https://learn.sparkfun.com/tutorials/ad8232-heart-rate-monitor-hookup-guide" height="80%" width="80%"/>
  <br>
  <span>Fonte: https://learn.sparkfun.com/tutorials/ad8232-heart-rate-monitor-hookup-guide</span>

* **NeuroSky&copy; mindwave**
	* Guia: http://download.neurosky.com/support_page_files/MindWave/docs/mindwave_user_guide.pdf
	* Sobre poorSignal > 0: http://support.neurosky.com/kb/development-2/poorsignal-greater-than-0

## Softwares usados
Os programas usados para este experimento foram instalados no sistema operacional Windows 7 64-bits. **Não foi feito a portabilidade para UNIX, macOS e BSD.**

### Leitura dos sinais
* Python 2 (IDLE e Editor de texto)

### Classificação das amostras
* Python 3
* [Spyder](https://www.spyder-ide.org/) (Obtido através do ambiente Anaconda)
* [Anaconda](https://www.anaconda.com/)

## Pendências
- [x] Adicionar descrição no código `principal.py` (atual `main.py`)
- [ ] Documentar projeto
- [ ] Documentar códigos
- [x] Tentar modularizar mais os códigos
- [x] Testar escrita em planilha com captura em tempo real
- [ ] Portar código de leitura para Python 3
- [ ] Criar uma GUI básica para quem for usar posteriormente\ 
(De preferêcia Tkinter por já vim com o Python)

<!---
* Leitura coração 20 frequencias por segundo;
--->
