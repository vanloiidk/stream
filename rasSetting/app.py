from twisted.internet.protocol import ReconnectingClientFactory
from autobahn.twisted.websocket import WebSocketClientProtocol, WebSocketClientFactory


class AppProtocol(WebSocketClientProtocol):

    def onConnect(self, response):
        print("Connected to the server")
        self.factory.resetDelay()

    def onOpen(self):
        print("Connection is open.")

        # when connection is open we send a test message the the server.

        def hello_server():

            #{"id":"tabvn","secret","key"}
            self.sendMessage(u"Pi here do youo have any job for me to do? ".encode('utf8'))
            # self.factory.reactor.callLater(1, hello_server)
        hello_server()

    def onMessage(self, payload, isBinary):
        if (isBinary):
            print("Got Binary message {0} bytes".format(len(payload)))
        else:
            print("Got Text message from the server {0}".format(payload.decode('utf8')))

    def onClose(self, wasClean, code, reason):
        print("Connect closed {0}".format(reason))


class AppFactory(WebSocketClientFactory, ReconnectingClientFactory):
    protocol = AppProtocol

    def clientConnectionFailed(self, connector, reason):
        print("Unable connect to the server {0}".format(reason))
        self.retry(connector)

    def clientConnectionLost(self, connector, reason):
        print("Lost connection and retrying... {0}".format(reason))
        self.retry(connector)


if __name__ == '__main__':
    import sys
    from twisted.python import log
    from twisted.internet import reactor

    server = "127.0.0.1"
    port = 3001

    log.startLogging(sys.stdout)
    factory = AppFactory(u"ws://127.0.0.1:3001")
    reactor.connectTCP(server, port, factory)
    reactor.run()
