from twisted.internet.protocol import ReconnectingClientFactory
from autobahn.twisted.websocket import WebSocketClientProtocol, WebSocketClientFactory
import json
import subprocess
import os

streaming_process = None

class App:
    def __init__(self):

        print("App is initial.")

    def stop_camera(self):
        global streaming_process

        if streaming_process is not None:

            print("Begin stopping camera")
            # streaming_process.kill()
            pid = streaming_process.pid+1
            os.kill(pid, 9)
            streaming_process = None
        else:
            print ("No streaming process so we dont need to do stop")

    def show_camera(self, is_bool):
        global streaming_process
        print("we need to show camera {0}".format(is_bool))

        if is_bool:

                print(streaming_process)
                if streaming_process is None:

                    ffmpeg_command = 'ffmpeg -f v4l2 -r 30 -i /dev/video0 -deinterlace -vcodec libx264 -pix_fmt yuv420p -preset medium -g 60 -b:v 2500k -acodec libmp3lame -ar 44100 -threads 6 -qscale 3 -b:a 712000 -bufsize 512k -f flv rtmp://localhost/live/tabvn'
                    streaming_process = subprocess.Popen(ffmpeg_command, shell=True, stdin=subprocess.PIPE)
                    # start_streaming.communicate()
                else:
                    print("Streaming is in process we are not accept more streaming.")
        else:
            self.stop_camera()

    def decode_message(self, payload):

        print("Got message need to decode {0}".format(payload))
        json_message = json.loads(payload)
        action = json_message.get('action')
        inp = json_message.get('payload')
        inp = str(inp)
        if inp == 'false' or inp == 'False':
            payload_value = 0
        else:
            payload_value = 1

        if action == 'stream':
            self.show_camera(payload_value)



class AppProtocol(WebSocketClientProtocol):

    def onConnect(self, response):
        print("Connected to the server")
        self.factory.resetDelay()

    def onOpen(self):
        print("Connection is open.")

        # when connection is open we send a test message the the server.

        def hello_server():

            message = {"action": "pi_online", "payload": {"id": "tabvn", "secret": "key"}}
            self.sendMessage(json.dumps(message))
            # self.sendMessage(u"Pi here do youo have any job for me to do? ".encode('utf8'))
            # self.factory.reactor.callLater(1, hello_server)
        hello_server()

    def onMessage(self, payload, isBinary):
        if (isBinary):
            print("Got Binary message {0} bytes".format(len(payload)))
        else:
            print("Got Text message from the server {0}".format(payload.decode('utf8')))
            # need to do decode this message and know what is server command
            app = App()
            app.decode_message(payload)

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
