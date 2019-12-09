from flask import Flask
from flask_restful import Api
from flask_restful.utils import cors
from api.name import NameAPI

app = Flask(__name__)
api = Api(app)
api.decorators = [cors.crossdomain(origin='*',
                                   headers='my-header, accept, content-type, token')]

api.add_resource(NameAPI, '/name')

if __name__ == '__main__':
    app.run(debug=True)
