var aaa = function() {};
try {
    var a;
    a.setSeconds(0);
    console.log('%s', a);
} catch (error) {
    console.log('%s', '2');
}
console.log('%s', '3');
