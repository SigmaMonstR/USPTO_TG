$(document).ready(function(){
    $("#appNum").inputmask({
        mask: "#{2}/#{3},#{3}",
        greedy: false,
        definitions: {
            '*': {
                validator: "[ 0-9A-Za-z!#$%&'*+=?^_`{|}~\.-]",
                cardinality: 1,
            },

            '#': {
                validator: "[0-9]",
                cardinality: 1,
            }
        }
    });

    $(":input").inputmask();
});