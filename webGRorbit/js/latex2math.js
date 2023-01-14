
String.prototype.indexesOf =  function (val) {
    var indexes = [], i;
    for(i = 0; i < this.length; i++)
        if (this[i] === val)
            indexes.push(i);
    return indexes;
}
function StartEndRemove (str,ele){
	var timesIndex = str.indexesOf(ele);
	for(i=0;i<timesIndex.length;i++){
		if(str[str.length-1]==ele){
			str = str.slice(0,str.length-1); 
		}
		if(str[0]==ele){
			str = str.slice(1,str.length); 
		}
	}
	return str
}

function latex2math (latex){
	var i,j,out = latex;
	out = out.toLowerCase();

	out = out.replaceAll('\\left','');
	out = out.replaceAll('\\right','');
	out = out.replaceAll('\\cdot','*');
	out = out.replaceAll('\\times','*');
	out = out.replaceAll('%','/100*');


	var Alphabets = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	for(i=0;i<26;i++){
		out = out.replaceAll(Alphabets[i],'')
	}

	var Redundant = ['\\','_','~',' ','(',')','{','}','[',']','|','#','&','$','@'];
	for(i=0;i<Redundant.length;i++){
		out = out.replaceAll(Redundant[i],'')
	}
	out = StartEndRemove(out,'-');
	out = StartEndRemove(out,'+');
	out = StartEndRemove(out,'*');
	out = StartEndRemove(out,'^');
	out = out.replaceAll('^','e');
	return eval(out);
}