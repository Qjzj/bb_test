class TreeNode {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

const COMPARE = {
  EQUAL: 'EQUAL',
  MORE_THAN: 'MORE_THAN',
  LESS_THAN: 'LESS_THAN',
};

function defaultCompare(a, b) {
  if(a === b) return COMPARE.EQUAL;
  return a > b ? COMPARE.MORE_THAN : COMPARE.LESS_THAN;
}

class BinarySearchTree {
  constructor(compareFn = defaultCompare) {
    this.root = null;
    this.compareFn = compareFn;
  }
  insert(key) {
    if(this.root === null) {
      this.root = new TreeNode(key);
    }else {
      this.insertNode(this.root, key);
    }
  }

  search(key) {
    if(this.root === null) {
      return false;
    }else {
      let current = this.root;
      while (current !== null && this.compareFn(current.key, key) !== COMPARE.EQUAL) {
        if(this.compareFn(key, current.key) === COMPARE.LESS_THAN) {
         current = current.left;
        }else {
          current = current.right;
        }
      }
      return current !== null;
    }
  }

  // 中序遍历
  inOrderTraverse(callback) {
    this.inOrderTraverseNode(this.root, callback);
  }

  // 先序遍历
  preOrderTraverse(callback) {
    this.preOrderTraverseNode(this.root, callback);
  }

  // 后序遍历
  postOrderTraverse(callback) {
    this.postOrderTraverseNode(this.root, callback);
  }




  insertNode(node, key) {
    let compareResult = this.compareFn(key, node.key);
    if(compareResult === COMPARE.LESS_THAN) {
      if(node.left === null) {
        node.left = new TreeNode(key)
      }else {
        this.insertNode(node.left, key);
      }
    }else if(compareResult === COMPARE.MORE_THAN){
      if(node.right === null) {
        node.right = new TreeNode(key);
      }else {
        this.insertNode(node.right, key)
      }
    }
  }

  inOrderTraverseNode(node, callback) {
    if(node !== null) {
      this.inOrderTraverseNode(node.left, callback);
      callback(node.key);
      this.inOrderTraverseNode(node.right, callback);
    }
  }

  preOrderTraverseNode(node, callback) {
    if(node !== null) {
      callback(node.key);
      this.preOrderTraverseNode(node.left, callback);
      this.preOrderTraverseNode(node.right, callback);
    }
  }

  postOrderTraverseNode(node, callback) {
    if(node !== null) {
      this.postOrderTraverseNode(node.left, callback);
      this.postOrderTraverseNode(node.right, callback);
      callback(node.key);
    }
  }

}

let bst = new BinarySearchTree();

/*bst.insert(8);
bst.insert(5);
bst.insert(10);
bst.insert(7);
bst.insert(4);
bst.insert(7);
bst.insert(12);
bst.insert(9);*/

// console.log(bst.search(1));
/*let str = '';
bst.preOrderTraverse(function(key) {
  str += key + ',';
});

console.log('先序', str);
str = '';

bst.inOrderTraverse(function(key) {
  str += key + ',';
});

console.log('中序', str);

str = '';
bst.postOrderTraverse(function(key) {
  str += key + ',';
});
console.log('后续', str);*/

var levelOrderBottom = function (root) {
  if(root === null) return [];
  let queue = [root];
  let result =[];
  while (queue.length) {
    let currentLevel = [];
    let len = queue.length;

    while (len > 0) {
      let cur = queue.shift();
      if(cur.left) queue.push(cur.left);
      if(cur.right) queue.push(cur.right);
      currentLevel.push(cur.val);
      len --;
    }

    result.push(currentLevel);
  }
  return result.reverse();
}
const arr = [1,2,3];
console.log(arr.reverse());
