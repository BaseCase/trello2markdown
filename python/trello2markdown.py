import json
import sys


def main():
    data = load_json_data_from_file()
    visible_lists = get_visible_lists(data)

    for l in visible_lists:
        print_list_name(l)
        visible_cards_in_list = get_visible_cards_in_list(l, data)

        for card in visible_cards_in_list:
            print_card(card)


def load_json_data_from_file():
    filename = sys.argv[1]
    data = {}
    with open(filename) as f:
        data = json.loads(f.read())
    return data


def get_visible_lists(trello_data):
    lists = [{'id': l['id'],
              'name': l['name']}
              for l in trello_data['lists']
              if not l['closed']]
    return lists


def print_list_name(trello_list):
    sys.stdout.write("# {}\n\n".format(trello_list['name']))


def get_visible_cards_in_list(trello_list, trello_data):
    cards = [c for c in trello_data['cards']
             if c['idList'] == trello_list['id']
             and not c['closed']]
    return cards


def print_card(trello_card):
    sys.stdout.write("## {}\n\n".format(trello_card['name']))
    sys.stdout.write("{}\n\n".format(trello_card['desc']))


if __name__ == '__main__':
    main()
