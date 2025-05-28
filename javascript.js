class HashMap {
    constructor() {
        this.map = new Array(this.capacity).fill(null).map(() => []);
        this.loadFactor = 0.8;
        this.capacity = 16;
        this.size = 0;
    }


    hash(key) {
        let hashCode = 0;
           
        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
          hashCode = primeNumber * hashCode + key.charCodeAt(i);
        }
     
        return hashCode % this.capacity;
    }
 
    set(key, value) {
        const hashKey = this.hash(key);
        let bucket = this.map[hashKey];
        
        if(bucket.length > 0) {
            if(bucket[0].isLinkedList) { // linked list. bucket looks like [[linked list object]]
                bucket[0].append([key, value]);
                this.map[hashKey] = bucket;

                this.size += 1;

            } else { //not linked list so there is only one [key, value] in bucket


                let sameKey = false;

                for (let i =0; i < bucket.length; i++) {
                    if(key == bucket[i][0]) {
                        bucket[i][1] = value;
                        sameKey = true;
                        break;
                    }
                }

                if(sameKey) {return};

                const currentKey = bucket[0][0];
                const currentValue = bucket[0][1];

                this.map[hashKey] = [];
                bucket = this.map[hashKey];

                const list = new LinkedList;

                list.prepend([currentKey, currentValue]); //item previously in bucket
                list.prepend([key, value]); // new item

                bucket.push(list);
                this.map[hashKey] = bucket;
                this.size += 1;

            }
        }
        if (this.needMoreBuckets()) {
            //call something to make new buckets and reassign all the sh.
        }
    }

    needMoreBuckets() {
        if(this.size >= this.capacity * this.loadFactor) {
            return true;
        } else {
            return false;
        }
    }

    has(key) {
        const hashKey = this.hash(key);
        let bucket = this.map[hashKey];

        if (!bucket[0]) {
            return false;
        }


        if(bucket[0].isLinkedList) {
            let list = bucket[0];

            let currentItem = list.head;


            for (let i = 0; i < list.size; i++) {
                if (currentItem.value[0] == key) {
                    return true; //same key found.
                }

                currentItem = currentItem.next;
            }

            return false;

        } else { //bucket just has one array. not a linked list

            if (bucket[0][0] == key) {
                return true; //same key has been found
            } else {
                return false;
            }

        }
    }


    get(key) {
        const hashKey = this.hash(key);
        let bucket = this.map[hashKey];


        if (!bucket[0]) {
            return null;
        }

        if(bucket[0].isLinkedList) {
            let list = bucket[0];

            let currentItem = list.head;


            for (let i = 0; i < list.size; i++) {
                if (currentItem.value[0] == key) {
                    return currentItem.value[1]; // key found. return value
                }

                currentItem = currentItem.next;
            }

            return null;

        } else { //bucket just has one array. not a linked list

            if (bucket[0][0] == key) {
                return bucket[0][1]; //key found return value
            } else {
                return null;
            }

        }

    }

    remove(key) {
        const hashKey = this.hash(key);
        let bucket = this.map[hashKey];


        if (!bucket[0]) {
            return false;
        }

        if(bucket[0].isLinkedList) {
            let list = bucket[0];

            let currentItem = list.head;


            for (let i = 0; i < list.size; i++) {
                if (currentItem.value[0] == key) {

                    list.delete(currentItem);
                    return true; // key found. remove node
                }

                currentItem = currentItem.next;
            }

            return false;

        } else { //bucket just has one array. not a linked list

            if (bucket[0][0] == key) {
                this.map[hashKey] = [];
                return true; //key found reset bucket
            } else {
                return false;
            }

        }
    }

    clear() {
        this.map = new Array(this.capacity).fill(null).map(() => []);
        this.loadFactor = 0.8;
        this.capacity = 16;
        this.size = 0;
    }

    entries() {
        let returnArray = [];

        for (let i = 0; i < this.capacity; i++) { //loop every bucket
            let bucket = this.map[i];

            if (bucket) {
                if (bucket.length > 0) {
                    if (bucket[0].isLinkedList) { // if linked list 
                        let list = bucket[0];
                        let currentNode = list.head;

                        for (let j = 0; j < list.size; j++) {   //loop all nodes
                            let key = currentNode.value[0];
                            let value = currentNode.value[1];

                            returnArray.push([key, value]);

                            currentNode = currentNode.next;
                        }


                    } else {
                        returnArray.push([bucket[0][0], bucket[0][1]]); // if its a single mother bucket. return the single key pair
                    }
                }
            }
        }

        return returnArray;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.isLinkedList = true;
    }

    prepend(value) {
        const newNode = new Node(value);

        newNode.next = this.head;
        this.head = newNode;
        this.size++;
    }

    append(value) {
        const newNode = new Node(value);

        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.size++;
    }

    delete(targetNode) {
        let current = this.head;
        let prev = null;

        while (current) {
            if (current == targetNode) {
                // delete node

                if(this.head == current) {
                    this.head = current.next;
                    return;
                }

                if (this.tail == current) {
                    this.tail = prev;
                    prev.next = null;
                    return;
                }

                //if not tail or not head

                prev.next = current.next;
                return;

            } else {
                prev = current;
                current = current.next; // should find the node before this is ever null.
            }
        }

    }

}

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}