
from BaseHTTPServer import HTTPServer
from optparse       import OptionParser
from RequestHandler import RequestHandler

def main():
    port = 8080
    print("\nListening on localhost:%s" % port)
    server = HTTPServer(('', port), RequestHandler)
    server.serve_forever()


if __name__ == "__main__":
    parser = OptionParser()
    parser.usage = ("Creates an http-server that will echo out any GET or POST parameters\n"
                    "Run:\n\n"
                    "   reflect")
    (options, args) = parser.parse_args()

    main()