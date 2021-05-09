
export const count = (function() {  // each of this functions has its inner Lexical environment {}, and every function refer to same 
                                    //outer Lexical env { counter }, global lexical env { declared variables in global environment }  
    let counter  = 0;
    
    return {
        increment: function() {
            ++counter;
        },
        decrement: function() {
            --counter;
        },
        get: function() {
            return counter;
        }
    };
  })();