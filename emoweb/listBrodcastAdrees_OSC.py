from pythonosc import dispatcher
from pythonosc import osc_server

# Conjunto para armazenar endereços OSC já exibidos
enderecos_exibidos = set()

# Função para exibir apenas os endereços OSC únicos recebidos
def generic_handler(unused_addr, *args):
    # Verifica se o endereço já foi exibido
    if unused_addr not in enderecos_exibidos:
        print(f"Endereço OSC: {unused_addr}")
        print("-" * 50)
        # Adiciona o endereço ao conjunto de exibidos
        enderecos_exibidos.add(unused_addr)

# Configurar o dispatcher para capturar todas as mensagens OSC
dispatcher = dispatcher.Dispatcher()
dispatcher.set_default_handler(generic_handler)  # Define um handler genérico para todas as mensagens

# Configurar o servidor OSC
ip = '192.168.0.6'
porta = 7456

server = osc_server.ThreadingOSCUDPServer((ip, porta), dispatcher)

print(f"Servidor OSC rodando no IP {ip}, porta {porta}. Aguardando dados...")

# Iniciar o servidor
try:
    server.serve_forever()  # O servidor fica ativo indefinidamente, aguardando mensagens
except KeyboardInterrupt:
    print("Servidor interrompido.")
finally:
    server.shutdown()
