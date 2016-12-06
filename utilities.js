module.exports = {
    //Filters out unique arrays
    unique: function(elem, pos, arr) {
        return arr.indexOf(elem) == pos;
    },
    //Checks if a json is empty
    isEmpty: function(obj) {
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    }
};