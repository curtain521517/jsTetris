<!DOCTYPE html>
<html>
<head>
	<title>css版方块</title>
	<meta charset="utf-8">
	<style type="text/css">

	div.smallbox
	{
		width: 28px;
		height:  28px;
		border-width: 1px;
		border-color: red;
		border-style:inset;
		border-radius:5px;

		padding: 0px;
		margin: 0px;
		background-color: purple;
	}

	div.clearsmallbox
	{
		width: 28px;
		height: 28px;
		border: 1px;

		border-radius:5px;
		border-style:inset;

		padding: 0px;
		margin: 0px;
	}


	div.box
	{
		width: 120px;
		height: 120px;
		margin: 0px;
		padding: 0px;
		border: 0px;
		display: flex;
		flex-wrap: wrap;
		position: absolute;
	}

	div.mainview
	{
		width: 360px;
		height: 600px;
		margin: 5px auto 0px;
		padding: 0px;
		border: 0px;
		position: relative;
		background-color: cyan;
		display: flex;
		flex-wrap: wrap;
	}

	</style>


</head>
<body onload="startGame()">
<div class="info" id = "info" style="margin: 0 auto;width: 360px;height: 40px;">
		<label id="score">分数:0</label>
		<br/>
		<label id="level">级别:1</label> 
</div>
	<!--主要显示沉积下来的方块  -->
<div class="mainview" id="mainview">
	<!-- 主要显示动的大方块 -->
	<div class="box" id="box"></div>
</div>

</body>
</html>

<script type="text/javascript">

	var kBoxWidth	  =         30;
	var kBoxHeight    =         30;

    var kBoardWide    =         12; //方块横向有12块
    var kBoardHigh    =         20; //方块竖向有20块

    var score = 0;
    var level = 0;
    var speed = 0;
    var boxId = 0;
    var nextboxId = 0;
    var timer = undefined;
    var currentBoxPoint = {x:5,y:0};
   	var bstart = 0; 
    var gBoard = new Array((kBoardHigh + 1) * (kBoardWide + 2));
    var gameOver = 0;

    var scorearr = [1000,3000,6000,10000,15000,20000,30000];
    var speedarr = [1000,950, 900, 800,  700,  600,  500];
    var nextlevelscore   = 1000;
    var mainview = document.getElementById("mainview");
    // 19 * 4 * 4
    var gXFBox = [
	    1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,       //0
	    0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,       //1
	    2,2,2,0,2,0,0,0,0,0,0,0,0,0,0,0,       //2
	    2,2,0,0,0,2,0,0,0,2,0,0,0,0,0,0,       //3
	    0,0,0,0,0,0,2,0,2,2,2,0,0,0,0,0,       //4
	    2,0,0,0,2,0,0,0,2,2,0,0,0,0,0,0,       //5
	    3,3,0,0,3,0,0,0,3,0,0,0,0,0,0,0,       //6
	    3,3,3,0,0,0,3,0,0,0,0,0,0,0,0,0,       //7
	    0,0,3,0,0,0,3,0,0,3,3,0,0,0,0,0,       //8
	    0,0,0,0,3,0,0,0,3,3,3,0,0,0,0,0,       //9
	    4,4,0,0,0,4,4,0,0,0,0,0,0,0,0,0,       //10
	    0,4,0,0,4,4,0,0,4,0,0,0,0,0,0,0,       //11
	    0,5,5,0,5,5,0,0,0,0,0,0,0,0,0,0,       //12
	    5,0,0,0,5,5,0,0,0,5,0,0,0,0,0,0,       //13
	    0,6,0,0,6,6,6,0,0,0,0,0,0,0,0,0,       //14
	    6,0,0,0,6,6,0,0,6,0,0,0,0,0,0,0,       //15
	    0,0,0,0,6,6,6,0,0,6,0,0,0,0,0,0,       //16
	    0,6,0,0,6,6,0,0,0,6,0,0,0,0,0,0,       //17
	    7,7,0,0,7,7,0,0,0,0,0,0,0,0,0,0        //18
	];


	function memset(arr)
	{
		for (var i = 0; i < arr.length; i++) {
			arr[i] = 0;
		}
	}


	function loc() 
	{
		if(arguments.length == 2)
		{
			return (arguments[0] * (kBoardWide + 2) + arguments[1]);

		}
		else if(arguments.length == 3) 
		{
			return (arguments[0] * 16 + arguments[1] * 4 + arguments[2]);
		}
	 }

	function  CGPointMake(x1,y1)
	{
		return {x:x1,y:y1};
	}

	function valueForPoint(pt)
	{
    	//适当的校验
    	if (pt.x < 0 || pt.x > kBoardWide + 1) {
        	return 1;
    	}
    	if (pt.y < 0 || pt.y > kBoardHigh) {
        	return 1;
    	}
    	return gBoard[loc(pt.y,pt.x)];
	}

	function setValueForPoint(pt)
	{
    	gBoard[loc(pt.y,pt.x)] = 1;

    	//changeViewWithPoint(pt);

    	//var iid = ""+(pt.x-1 + (pt.y * kBoardWide));
	    //document.getElementById(iid).setAttribute("class","smallbox");
	}
	
	function createDivByID(str)
	{
		var div = document.createElement("div");
		div.setAttribute("class",str);

		return div;
	}


	function init() {

		var mainview = document.getElementById("mainview");

		// 无色方块
		for(var i = 0 ; i < 20*12 ; i++)
		{
			var div = createDivByID("clearsmallbox");
			div.setAttribute("id", "" + i);
			mainview.appendChild(div);
		}

		var box = document.getElementById("box");
		// 旋转方块
		for(var i = 0 ; i < 4 * 4 ; i++)
		{
			var div = createDivByID("smallbox");
			div.setAttribute("id","f"+i);
			box.appendChild(div);
		}

	}

	function initData()
	 {
	 	memset(gBoard);
	 	for(var j = 0 ; j < kBoardWide + 2 ; j++)
         	gBoard[loc(kBoardHigh,j)] = 1;
    
	    //both side set 1
	    for(var i = 0 ; i < kBoardHigh + 1 ; i++)
	    {
	        gBoard[loc(i,0)] = 1;
	        gBoard[loc(i,(kBoardWide+1))] = 1;
	    }
	 	score = 0;
    	level = 0;
    	speed = 1000;
    	nextboxId = parseInt(Math.random()*1000) % 19;
    	boxId = nextboxId;

    	timer = undefined;
    	currentBoxPoint = {x:(kBoardWide/2),y:0};
   		bstart = 0;
   		gameOver = 0;
   		nextlevelscore = 1000;
	}

	function startGame()
	{
		init();
		initData();
		drawFloatBox();
		drawAllBox();

		document.addEventListener("keydown",onkeydown);

		timer = setInterval(ontimer,speed);
	}

	function ontimer()
	{
		onDown();
		setNeedDisPlay();
	}

	function onkeydown(event)
	{
		if(gameOver)
			return;

		if(event.keyCode == 27)
		{
			window.close();
		}
		// 下
		if (event.keyCode == 40 ||  event.keyCode == 83) 
		{
			// 这里主面板数据可能会变动，重绘一下，当然也可以实时更新...
			onDown();
			setNeedDisPlay();
		}
		// 上
		else if(event.keyCode == 38 || event.keyCode == 87) 
		{
			onRotate();
			drawFloatBox();

		}
		// left
		else if(event.keyCode == 37 || event.keyCode == 65) 
		{
			onLeft();
			drawFloatBox();
		}
		// right
		else if( event.keyCode == 39 || event.keyCode == 68) 
		{
			onRight();
			drawFloatBox();
		}
	}

	function setNeedDisPlay()
	{
		drawFloatBox();
		drawAllBox();
	}

	function showInfo()
	{
		document.getElementById("score").innerHTML="分数: " + score;
		document.getElementById("level").innerHTML="级别: " + (level + 1);
	}


	function drawAllBox()
	{	    
	    //从下往上画
	    for (var i = kBoardHigh - 1; i>=0; i--) 
	    {
	        for (var j = 1; j <= kBoardWide ; j++) 
	        {
	        	var iid = ""+(j-1 + (i * kBoardWide));
	            if (gBoard[loc(i,j)] == 1) 
	            {
	            	document.getElementById(iid).setAttribute("class","smallbox");
	            }
	            else 
	            {
	            	document.getElementById(iid).setAttribute("class","clearsmallbox");
	            }
	        }
	    }
	}

	function drawFloatBox()
	{
	    if (boxId > 18) 
	        return;
	   	document.getElementById("box").style.left = (currentBoxPoint.x*kBoxWidth)+"px";
	    document.getElementById("box").style.top =  (currentBoxPoint.y*kBoxHeight)+"px";

	    for (var i = 0; i < 4; i++) {
	        for (var j = 0; j < 4; j++) 
	        {
	        	var div = document.getElementById("f"+(i*4+j));
	            if (gXFBox[loc(boxId,i,j)] != 0) 
	            {
	                div.setAttribute("class","smallbox");
	                div.style.visibility = "visible";
	            }
	            else 
	            {
	            	div.setAttribute("class","clearsmallbox");
	            	div.style.visibility = "hidden";
	            }
	        }
	    }
	}

	function createTetris()
	{
    	boxId = nextboxId;
    	nextboxId = parseInt(Math.random()*1000) % 19;

    	currentBoxPoint.x = (kBoardWide/2);
    	currentBoxPoint.y = 0;

	}

	function canDown()
	{
    	for (var i = 0; i < 4; i++) {
        	for (var j = 0 ; j < 4; j++) {
            	if (gXFBox[loc(boxId,i,j)] != 0) {
                	var pt = CGPointMake(currentBoxPoint.x + j + 1, currentBoxPoint.y + i + 1);
                	if (valueForPoint(pt) == 1) {
                    	return false;
                	}
            	}
        	}
    	}
    	return true;
	}

	function onDown()
	{
    	if (canDown()) 
    	{
        	currentBoxPoint.y++;
    	}
    	else 
    	{
    		put();
			var s = dealFull();
			if (s > 0) {

				score += s;
				//定级
				if(score >= nextlevelscore)
				{
					level++;
					speed = speedarr[level];

					timer = clearInterval(timer);
					timer = setInterval(ontimer, speed);
				}
				showInfo();
			}
			createTetris();
			if(!canDown()){
				gameOver = 1;
				var res = confirm("游戏结束是否重玩?");
				if (res == true) 
				{
					startGame();
				}
				else 
				{
					window.close();
				}
			}
    	}
	}

	function canRight()
	{
    	for (var i = 0 ; i < 4; i++) {
        	for (var j = 0; j < 4; j++) {
            	if (gXFBox[(loc(boxId,i,j))] != 0) {
                	var pt = CGPointMake(currentBoxPoint.x + j + 1 + 1, currentBoxPoint.y + i);
                	if (valueForPoint(pt) == 1) {
                    	return false;
                	}
            	}
        	}
    	}
    	return true;
	}

	function onRight()
	{
    	if (canRight()) {
        	currentBoxPoint.x++;
    	}
	}

	function canLeft()
	{
    	for (var i = 0 ; i < 4; i++) {
        	for (var j = 0; j < 4; j++) {
            	if (gXFBox[loc(boxId,i,j)] != 0) {
                	var pt = CGPointMake(currentBoxPoint.x + j + 1 - 1, currentBoxPoint.y + i);
                	if (valueForPoint(pt) == 1) {
                    	return false;
                	}
            	}
        	}
    	}
    	return true;
	}

	function onLeft()
	{
    	if (canLeft()) {
        	currentBoxPoint.x--;
    	}
	}

	function  canRotate(nextBoxId)
	{
	    for (var i = 0; i < 4; i++) {
	        for (var j = 0 ; j < 4; j++) {
	            if (gXFBox[loc(nextBoxId,i,j)] !=0) {
	                //var pt = {x:currentBoxPoint.x + j + 1, y:currentBoxPoint.y + i};
	                var pt = CGPointMake(currentBoxPoint.x + j + 1, currentBoxPoint.y + i);
	                if (valueForPoint(pt) == 1) {
	                    return false;
	                }
	                
	            }
	        }
	    }
	    return true;
	}

	function onRotate()
	{
	    var next_box = 0;
	    switch(boxId)
	    {
	        case 0:next_box=1;break;
	        case 1:next_box=0;break;
	        case 2:next_box=3;break;
	        case 3:next_box=4;break;
	        case 4:next_box=5;break;
	        case 5:next_box=2;break;
	        case 6:next_box=7;break;
	        case 7:next_box=8;break;
	        case 8:next_box=9;break;
	        case 9:next_box=6;break;
	        case 10:next_box=11;break;
	        case 11:next_box=10;break;
	        case 12:next_box=13;break;
	        case 13:next_box=12;break;
	        case 14:next_box=15;break;
	        case 15:next_box=16;break;
	        case 16:next_box=17;break;
	        case 17:next_box=14;break;
	        case 18:next_box=18;break;
	    }
	    
	    if (canRotate(next_box)) {
	        boxId = next_box;
	    }
	}

	function canPut()
	{
    	for (var i = 0; i < 4; i++) {
        	for (var j = 0 ; j < 4; j++) {
            
            	    var pt = CGPointMake(currentBoxPoint.x + j + 1, currentBoxPoint.y + i);
                	if (valueForPoint(pt) == 1) {
                    	return false;
                	}
        	}
    	}
    	return true;
	}

	function put()
	{
		for (var i = 0; i < 4; i++) {
        	for (var j = 0 ; j < 4; j++) {
            	if (gXFBox[(loc(boxId,i,j))]) {
                	var pt = CGPointMake(currentBoxPoint.x + j + 1, currentBoxPoint.y + i);
                	setValueForPoint(pt);
            	}
        	}
    	}
	}

	function checkFullRow(row)
	{
    	for (var j = 1; j <= kBoardWide; j++) {
        	if (gBoard[loc(row,j)] == 0) {
            	return false;
        	}
    	}
    	return true;
	}

	function setEmptyRow(row)
	{
    	for (var j = 0; j <= kBoardWide; j++) {
        	gBoard[loc(row,j)] = 1;

    	}
	}

	function copyDestRow(dest,src)
	{
    	for (var j = 1; j<=kBoardWide; j++) {
        	gBoard[loc(dest,j)] = gBoard[loc(src,j)];
    	}
	}

	function dealFullFall(row)
	{
    	var k = 0;
    	for (k = row; k >= 1; k--) {
        
        	// k--k-1,上面的方块下落
        	copyDestRow(k,k-1);
    	}
	}

	function dealFull()
	{
    	var nCount = 0;
	    var score = 0;
	    for (var i = kBoardHigh - 1; i >= 0 ; i--) {
	        
	        if (checkFullRow(i)) {
	            setEmptyRow(i);
	            dealFullFall(i);
	            
	            //reSet
	            i++;
	            
	            nCount++;
	        }
	    }
	    
	    switch (nCount) {
	        case 1:
	            score+=100;
	            break;
	        case 2:
	            score+=300;
	            break;
	        case 3:
	            score+=500;
	            break;
	        case 4:
	            score+=700;
	            break;
	        default:
	            break;
	    }
	    return score;
}

</script>
