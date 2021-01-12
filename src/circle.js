(function () {
    console.log(666)
    function circle(num){
        num ++;
        console.log(num);
        if(num > 5) return
        setTimeout(() => {
            circle(num)
        }, 1000);
    }

    let num = 0
    circle(num)
})()