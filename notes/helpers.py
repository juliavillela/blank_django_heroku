def find_first(collection):
    temp = list(collection)
    for item in collection:
        if item.next != None:
            not_first = item.next
            temp.remove(not_first)
    if len(temp) != 1:
        return None
    else: 
        print(temp[0])
        return temp[0]

def order(first, ordered=[]):
    """sorts linked-list like elents and returns them in ascending order"""
    if first.next == None:
        ordered.append(first)
        return ordered
    else:
        ordered.append(first)
        return order(first.next, ordered)

def serialize_all(note):
    steps = note.ordered_steps()
    
