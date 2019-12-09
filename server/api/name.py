import emoji
import random
import hashlib
from flask_restful import Resource, reqparse
from generator import KeyGenerator
from tinydb import Query
from db import db

emoji_list = emoji.EMOJI_UNICODE.keys()
table = db.table('name')


def generate_emojis(size=10):
    emojis = random.sample(emoji_list, size)
    return emoji.emojize("".join(emojis))


def get_private_key_from_emojis(emojis):
    kg = KeyGenerator()
    kg.seed_input(emojis)
    key = kg.generate_key()
    return key


def get_pk_hash(private_key):
    return hashlib.sha256(private_key.encode()).hexdigest()


nameParser = reqparse.RequestParser()
nameParser.add_argument('name', type=str)

emojiParser = reqparse.RequestParser()
emojiParser.add_argument('emojis', type=str)


class NameAPI(Resource):
    def options(self):
        pass

    def post(self):
        args = nameParser.parse_args()
        name = args['name']
        if name is None:
            return ("No name in post data", 400)

        emojis = generate_emojis()
        private_key = get_private_key_from_emojis(emojis)
        pk_hash = get_pk_hash(private_key)
        table.insert({'name': name, 'hash': pk_hash})

        return ({'emojis': emojis}, 201)

    def get(self):
        args = emojiParser.parse_args()
        emojis = args['emojis']
        if emojis is None:
            return ("No emojis in query data", 400)

        private_key = get_private_key_from_emojis(emojis)
        pk_hash = get_pk_hash(private_key)
        Name = Query()
        res = table.search(Name['hash'] == pk_hash)
        if len(res) != 1:
            return ("Cannot find name for the emojis", 400)

        return (res[0], 201)
