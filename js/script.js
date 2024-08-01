let rulesbtn = document.querySelector('.rules-btn');
let rulesarea = document.querySelector('.rules-area');

rulesbtn.addEventListener('click' , function(){
    if(rulesarea.style.display === 'block'){
        rulesarea.style.display = 'none';
        
    }
    else{
        rulesarea.style.display = 'block';
    }
});

document.addEventListener('click' , function(e){
    if(!rulesarea.contains(e.target) && !rulesbtn.contains(e.target)){
        rulesarea.style.display = 'none';
    }
    });
