
//Tag List

 Array.prototype.unique =
          function() {
            var a = [];
            var l = this.length;
            for(var i=0; i<l; i++) {
              for(var j=i+1; j<l; j++) {
                // If this[i] is found later in the array
                if (this[i] === this[j])
                  j = ++i;
              }
              a.push(this[i]);
            }
            return a;
          };

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
};


//Count word frequency
function freqCount(arr) {
          var a = [], b = [], prev;
          arr.sort();
          for ( var i = 0; i < arr.length; i++ ) {
              if ( arr[i] !== prev ) {
                  a.push(arr[i]);
                  b.push(1);
              } else {
                  b[b.length-1]++;
              }
              prev = arr[i];
          }
          var word = a;
          var freq = b;
          var output = [word,freq];
          return output;
      }

//Array Remove by val
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
//Table generate
        function tablegenerate(words,freqs) {
            $("#myTable").empty();
            for(i=0; i<28;i += 4){
                 var $formrow = '<tr><td class="tagbtn">'+ words[i] +'</td><td>'+ freqs[i] + '</td><td class="tagbtn">'+words[i+1]+'</td><td>'+freqs[i+1]+'</td><td class="tagbtn">'+words[i+2]+'</td><td>'+freqs[i+2]+'</td><td class="tagbtn">'+words[i+3]+'</td><td>'+freqs[i+3]+'</td></tr>';
                $('#myTable').append($formrow);
            }
        };




//Extract Column
    function getCol(matrix, col){
                              column = [];
                             for(var i=0; i<matrix.length; i++){
                                column.push(matrix[i][col]);
                             }
                             return column;
                          }
  

//uniques
Array.prototype.unique =
          function() {
            var a = [];
            var l = this.length;
            for(var i=0; i<l; i++) {
              for(var j=i+1; j<l; j++) {
                // If this[i] is found later in the array
                if (this[i] === this[j])
                  j = ++i;
              }
              a.push(this[i]);
            }
            return a;
          };

//Variables
  masterlist = [];
  words = [];
  freqs = [];

  var photo_ids = [] ;
  var photo_link = [];
  var front = ["https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=8d2fdd51698bdc117f0ec0c6e2e11ab5&format=json&nojsoncallback=1&photo_id="];


//Double click selection
    $("#photos").dblclick(function() {
        
      //Extract photo IDs from photo URL
         source = $(this).find("img").attr("src");
         temp1 =  source.split("/").slice(4)[0];
         temp2 = temp1.indexOf("_");
         temp3 = temp1.substr(0,temp2);

       //Check if value is in photo list
          var searchindex = photo_ids.indexOf(temp3);

          // if photo is in list, remove it
           if (searchindex > -1) {
                //remove from list
                  photo_ids.splice(searchindex, 1);
                  photo_link.splice(searchindex, 1);
                  console.log(photo_ids);
                   $("#myTable").empty();
                  tag_generator();

            } else {

              //If this is a new photo, add to list 
                photo_ids.push(temp3);
                photo_link.push(source);
                console.log(photo_ids);
                 $("#myTable").empty();
                tag_generator();
                }

        //Update Cart Counter
           $("#cart").empty();
           var $formrow = "Cart: "+photo_ids.length ;
                $('#cart').append($formrow);
             });

function tag_generator(){  

        masterlist = [];
        words = [];
        freqs = [];
        var url = [];
        finallist=[];

        console.log("ML: "+ masterlist.length);

            for(j = 0; j<photo_ids.length; j++){
                url[j]=front + photo_ids[j];
                //console.log(url);
                }

        //Master Array  
            for(j=0; j<=photo_ids.length; j++){

              $.ajax({
                  url: url[j],
                  dataType: 'json',
                  success: function(results){
                      var title = results.photo.title._content;
                      var title2 = results.photo.description._content;
                      var consol = title + " " +title2;
                      var consol = consol.toLowerCase()
                                   .replace(/[\.,-\/#!$%\^&\@*;:{><"}=\-_`~()]/g," ")
                                   .replace(/[0-9]/g,"")
                                   .replace("www","")
                                   .replace(" ","");

                     var arr = consol.split(" ");
                     var arr = arr.unique();

                     //console.log("Array "+j+": "+arr.length);

                      masterlist.push.apply(masterlist, arr);
                      masterlist.remove('this').remove('with').remove('about').remove('have').remove('just')
                                .remove('quot').remove('then').remove('here').remove('back').remove('that')
                                .remove('were').remove('from').remove('some').remove('thing').remove('down')
                                .remove('took').remove('quot').remove('http').remove('href').remove('follow')
                                .remove('between').remove('however').remove('therefore').remove('nofollow')
                                .remove('all').remove('always').remove('after').remove('instagram').remove('facebook')
                                .remove('talk').remove('wiki').remove('body').remove('www').remove('')
                                .remove('wikipedia');

                      

                      for( z=0; z < masterlist.length; z++) {
                             if(masterlist[z].length<=3){
                                  masterlist.remove(masterlist[z]);
                                }
                            }

                      console.log("ML: "+masterlist.length);

                      var result = freqCount(masterlist);
                      console.log("Count: "+result[0].length);

                    //Reformat arrays
                       finallist = []; // Array
                        for(i = 0; i<=result[0].length; i++){
                          if(typeof result[0][i]===undefined){
                            } else if(typeof result[1][i]===undefined){
                            } else{
                              finallist.push([result[0][i], result[1][i] ]);
                            }  
                          };

                       
                    //sort array
                      finallist.sort(function(a, b) {
                          return b[1] - a[1]
                        });

                      console.log(finallist);

                       // console.log(finallist);

                        
                      // $.each( finallist, function( key, value ) {

                      //         if(typeof value[0] === 'undefined'){
                      //               } else if(value[0].length <=3){
                      //               } else {
                      //                words.push(value[0]);
                      //                //freqs.push(Math.round(100*value['freq']/photo_ids.length)+"%");
                      //                freqs.push(value[1]);
                      //                //console.log(value['word']);
                      //                 }
                      //       });

                $("#myTable").empty();

                words =  getCol(finallist, 0); //Get first column
                words.remove(undefined);
                words.remove('undefined');

                freqs =  getCol(finallist, 1); //Get first column
                freqs.remove(undefined);
                freqs.remove('undefined');

                console.log(words);
                tablegenerate(words,freqs);

                        }
                      });
                  };

              
               
              };

              

