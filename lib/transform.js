//(function(root, mod) {
//  if (typeof exports == "object" && typeof module == "object") // CommonJS
//    return mod(exports, require("acorn"));
//  if (typeof define == "function" && define.amd) // AMD
//    return define(["exports", "acorn/dist/acorn"], mod);
//  mod(root.tern || (root.tern = {}),acorn); // Plain browser env
//})(this, function(exports, acorn) {
//  "use strict";

var propWithNoIdentfier = [];

var sourceText = "";

var source = {
	file : "",
	types : [type],
	score : ""
		
};

var type = {
	name : "",	
	typeName : "",
	lineNumbers : [line],
	properties : [property],
	children : "",
};

var child = {
	name : "",
	type : "",
	line : ""
}

var line = {
	lineNumber : "",
	startColumn : "",
	endColumn : "",
}

var property = {
	propertyName : "",
	line : ""
}

exports.transform = function(ast, outline, memberExpressionsNodes, acorn){
	getSourceDetails(ast);
	outline.forEach(function(inType) {
		var typ = Object.create(type);
		
		var typName = inType.type;
		typ.typeName = typName;
		typ.name = inType.name;
		
		var typeChildren = [];
		if( typeof inType.children !== 'undefined' && inType.children){
			inType.children.forEach(function(child) {
				var childDet = Object.create(child);
				childDet.name = child.name;
				childDet.type = child.type;
				
				var childLine = Object.create(line);
				var startValues = acorn.getLineInfo(sourceText, child.start);
				childLine.lineNumber = startValues.line;
				childLine.startColumn = startValues.column;
				
				var endValues = acorn.getLineInfo(sourceText, child.end);
				childLine.endColumn = endValues.column;
				
				childDet.line = childLine;
				typeChildren.push(childDet)
			})
		}
		
		typ.children = typeChildren;
		
		var lineNums  = [];
		var props = [];
		
		var typeLine = Object.create(line);
		var startValues = acorn.getLineInfo(sourceText, inType.start);
		typeLine.lineNumber = startValues.line;
		typeLine.startColumn = startValues.column;
		
		var endValues = acorn.getLineInfo(sourceText, inType.end);
		typeLine.endColumn = endValues.column;
		
		lineNums.push(typeLine);
		
		memberExpressionsNodes.forEach( function(memberExpressionsNode){
			
			if(typeof memberExpressionsNode.object !== 'undefined' && memberExpressionsNode.object
					&& typeof memberExpressionsNode.property !== 'undefined' && memberExpressionsNode.property){
				var memberObject = memberExpressionsNode.object;
				var memberProperty = memberExpressionsNode.property;
				
				if( typeof memberObject.name !== 'undefined' && memberObject.name
						&& typeof memberProperty.name !== 'undefined' && memberProperty.name){

					var memberName = memberObject.name;
						if(typName == memberName){
							var prop = Object.create(property);
							
							var propName = memberProperty.name;
							prop.propertyName = propName;
							
							var propLine = Object.create(line);
							var startValues = acorn.getLineInfo(sourceText, memberProperty.start);
							propLine.lineNumber = startValues.line;
							propLine.startColumn = startValues.column;
							
							var endValues = acorn.getLineInfo(sourceText, memberProperty.end);
							propLine.endColumn = endValues.column;
							
							prop.line = propLine;
							
							lineNums.push(propLine);
							
							props.push(prop);
					}
				}
			}
		})
		typ.properties = props;
		typ.lineNumbers=lineNums;
		source.types.push(typ);
	})
		console.log(JSON.stringify(source));
	};

var getSourceDetails = function(ast){
	if(typeof ast !== 'undefined' && ast ){
		if(typeof ast.sourceFile !== 'undefined' && ast.sourceFile){
			var astSource = ast.sourceFile;
			sourceText = astSource.text;
			source.file = astSource.name;
		}
	}else{
		source.file = "";
	}
}	
	
//});