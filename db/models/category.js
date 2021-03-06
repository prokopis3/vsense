"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
;
var Category = /** @class */ (function () {
    function Category(dbCollectionName) {
        var schema = new mongoose_1.Schema({
            _id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
            name: { type: String, required: true },
            desc: { type: Number, required: true },
            icon: { type: String, required: true },
            parent_id: { type: String, ref: 'Category' },
            children: { type: Array, ref: 'Category' },
            created: { type: Date, default: Date.now() },
            modified: { type: Date },
            status: { type: String, default: 'active' },
            recyclebin: { type: Boolean, default: false },
        });
        this._model = mongoose_1.model(dbCollectionName, schema, dbCollectionName);
    }
    Object.defineProperty(Category.prototype, "model", {
        get: function () {
            return this._model;
        },
        enumerable: true,
        configurable: true
    });
    return Category;
}());
exports.Category = Category;
/* // Map function
export const map = (): any => {

  // We need to save this in a local var as per scoping problems
  var document: ICategory;

  // You need to expand this according to your needs
  var stopwords = ["the","this","and","or"];

  for(var prop in document) {

    // We are only interested in strings and explicitly not in _id
    if(prop === "_id" || typeof document[prop] !== 'string') {
      continue
    }

    (document[prop]).split(" ").forEach(
      function(word: any){

        // You might want to adjust this to your needs
        var cleaned = word.replace(/[;,.]/g,"")

        if(
          // We neither want stopwords...
          stopwords.indexOf(cleaned) > -1 ||
          // ...nor string which would evaluate to numbers
          !(isNaN(parseInt(cleaned))) ||
          !(isNaN(parseFloat(cleaned)))
        ) {
          return
        }
        emit(cleaned,document._id)
      }
    )
  }
};

// Reduce function
export const reduce = (k:any,v: any) => {
  
    // Kind of ugly, but works.
    // Improvements more than welcome!
    var values = { "documents": ['']};
    v.forEach(
      (el: any) => {
        if(values.documents.indexOf(el)>-1){
          return
        }
        values.documents.push(el)
      }
    )
    return values
  };

export const finalOut: object = {
    
}

export const MapReduceOfCategories: ModelMapReduceOption<ICategory, any, any> = {
    map,
    reduce,
    // We need this for two reasons...
    finalize: (_key: any, reducedValue: any) => {

        // First, we ensure that each resulting document
        // has the documents field in order to unify access
        var finalValue = {documents:[]}

        // Second, we ensure that each document is unique in said field
        if(reducedValue.documents) {

          // We filter the existing documents array
          finalValue.documents = reducedValue.documents.filter(
            (item:any,pos:any,self:any) => {

              // The default return value
              var loc = -1;

              for(var i=0;i<self.length;i++){
                // We have to do it this way since indexOf only works with primitives

                if(self[i].valueOf() === item.valueOf()){
                  // We have found the value of the current item...
                  loc = i;
                  //... so we are done for now
                  break
                }
              }

              // If the location we found equals the position of item, they are equal
              // If it isn't equal, we have a duplicate
              return loc === pos;
            }
          );
        } else {
          finalValue.documents.push(reducedValue)
        }
        // We have sanitized our data, now we can return it
        return finalValue

      },
    verbose: true,
    // Our result are written to a collection called "categorywords"
    out: { replace: 'CategoryWords'}
}
 */
