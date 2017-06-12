<!DOCTYPE html>
<html>
<head>
	<title>俄罗斯方块</title>
</head>
<body >

<!-- 画画板区域 -->
<div style="margin: 50px auto; padding: 0; border: 0; width: 510px; height: 600px; background-color: cyan; position: relative;" >


	<div id="board" style="margin: 0; background-color: rgba(240,245,246,1); width: 360px; height: 600px">
		<canvas id="mainview" width=360px height=600px ></canvas>
	</div>

	<div style="margin: 0; background-color: rgba(240,245,246,1);width: 150px;height: 600px;position: absolute; left:360px;top: 0px">
		<p style="text-align: center; ">下一方块</p>
		<div style="margin: 0 auto;width: 120px;height: 120px">
			<canvas id="nextview" width=120px height=120px></canvas>
		</div>
		<p style="text-align: center;"><span> <label id="score">分数:0</label> </span></p>
		<p style="text-align: center;"><span> <label id="level">级别:1</label> </span></p>
	</div>
	<div id = "start" style="margin: auto; background-color: rgba(255,255,255,0.8);position: relative; left: 0;top: -600px;width: 510px;height: 600px">
		
		<input type="button" value="开始" onclick="startGame()" style="width: 80px;height: 50px;text-align: center;margin: 275px 215px 275px 215px ; font-size: 200%">
	</div>


</body>
</html>

<script type="text/javascript">
	
	var kScreenWidth  = document.getElementById("mainview").offsetWidth;
	var kScreenHeight = document.getElementById("mainview").offsetHeight;

    var kBoardWide    =         12; //方块横向有12块
    var kBoardHigh    =         20; //方块竖向有20块

    var kBoxWidth     = (kScreenWidth/kBoardWide);   //方块的宽度
    var kBoxHeight    = (kScreenWidth/kBoardWide);  //一样宽
    var kOriginY      = 0;//(kScreenHeight-(kBoardHigh * kBoxHeight)); //方块顶格的高度pt


    var c=document.getElementById("mainview");
	var ctx=c.getContext("2d");
	var ctxNext = document.getElementById("nextview").getContext("2d");
	var fillStyle = "#9B30FF"//rgba(255,255,200,0.8)";
	var strokeStyle = "rgba(255, 255, 255, 1)";
	var nextbackgroundcolor ="rgba(29,30,25,1)";
	var boardbackgroundcolor = "rgba(29,30,25,1)";

    var score = 0;
    var level = 0;
    var speed = 0;
    var boxId = 0;
    var nextboxId = 0;
    var timer = undefined;
    var currentBoxPoint = {x:0,y:0};
   	var bstart = 0; 
    var gBoard = new Array((kBoardHigh + 1) * (kBoardWide + 2));
    var gameOver = 0;

    var scorearr = [1000,3000,6000,10000,15000,20000,30000];
    var speedarr = [1000,950, 900, 800,  700,  600,  500];
    var nextlevelscore   = 1000;
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
    	currentBoxPoint = {x:0,y:0};
   		bstart = 0;
   		gameOver = 0;
   		nextlevelscore = 1000;

	 }

	//drawGrid();

	function drawGrid()
	{	
		var top = kScreenHeight - kBoardHigh*kBoxHeight;
    	var bottom = kScreenHeight;

		//画横线，
		ctx.beginPath();
		ctx.strokeStyle = strokeStyle;
		ctx.lineWidth = 1.5;
		ctx.lineCap = "round";
		ctx.setLineDash([5,15]);
    	for(var i = 0 ; i <= kBoxHeight ; i++)
    	{
        	ctx.moveTo(0, top + i*kBoxHeight);
        	ctx.lineTo(kBoxWidth*kBoardWide + 0,top + i * kBoxHeight);
    	}

    	for(i = 0 ; i <= kBoardHigh ; i++)
    	{
        	ctx.moveTo(i * kBoxWidth, top);
        	ctx.lineTo(i * kBoxWidth, bottom);
    	}
    	//ctx.closePath();
    	ctx.stroke();

		//
    	//画横线，
		ctxNext.beginPath();
		ctxNext.strokeStyle = "rgba(255, 255, 255, 0.6)";
		ctxNext.lineWidth = 1.5;
		ctxNext.lineCap = "round";
		ctxNext.setLineDash([5,15]);

		top = 0;
		bottom = 4*kBoxHeight;
    	for(var i = 0 ; i <= 4 ; i++)
    	{
        	ctxNext.moveTo(0, top + i*kBoxHeight);
        	ctxNext.lineTo(kBoxWidth*kBoardWide + 0,top + i * kBoxHeight);
    	}

    	for(i = 0 ; i <= 4 ; i++)
    	{
        	ctxNext.moveTo(i * kBoxWidth, top);
        	ctxNext.lineTo(i * kBoxWidth, bottom);
    	}
    	//ctxNext.closePath();
    	ctxNext.stroke();
	}



	function drawAllBox()
	{	    
	    //从下往上画
	    for (var i = kBoardHigh - 1; i>=0; i--) 
	    {
	        for (var j = 1; j <= kBoardWide ; j++) 
	        {
	            if (gBoard[loc(i,j)] == 1) 
	            {
	            	ctx.fillStyle = fillStyle;
	            	ctx.fillRect(kBoxWidth * (j-1), kOriginY + i*kBoxHeight, kBoxWidth, kBoxHeight);
	            }
	        }
	    }
	}

	function drawFloatBox()
	{
	    if (boxId > 18) 
	        return;
	    	    
	    ctx.fillStyle = fillStyle;
	    for (var i = 0; i < 4; i++) {
	        for (var j = 0; j < 4; j++) {
	            if (gXFBox[loc(boxId,i,j)] != 0) {
	                ctx.fillRect((currentBoxPoint.x+j) * kBoxWidth, (currentBoxPoint.y+i)*kBoxHeight + kOriginY, kBoxWidth, kBoxHeight);
	            }
	        }
	    }
	}


	function drawNextBox()
	{
		for (var i = 0; i < 4; i++) 
		{
	        for (var j = 0; j < 4 ; j++) 
	        {
	            if (gXFBox[loc(nextboxId,i,j)] ) 
	            {
	            	ctxNext.fillStyle = fillStyle;
	            	ctxNext.fillRect(kBoxWidth * j, i*kBoxHeight, kBoxWidth, kBoxHeight);
	            }
	        }
	    }
	}

	function showInfo()
	{
		document.getElementById("score").innerHTML="分数: " + score;
		document.getElementById("level").innerHTML="级别: " + (level + 1);
	}

	//绘制
	function draw()
	{
		if(bstart==1)
			drawNextBox();
		drawAllBox();
		drawFloatBox();
		drawGrid();

		showInfo();
	}

	//
	function setNeedDisPlay()
	{
		ctx.fillStyle = boardbackgroundcolor;
		ctxNext.fillStyle = nextbackgroundcolor;
		ctx.fillRect(0,0,kScreenWidth,kScreenHeight);
		ctxNext.fillRect(0,0,120,120);

		draw();
	}

	function createTetris()
	{
    	boxId = nextboxId;
    	nextboxId = parseInt(Math.random()*1000) % 19;

    	currentBoxPoint.x = (kBoardWide/2);
    	currentBoxPoint.y = 0;

    	setNeedDisPlay();
	}


	function startGame()
	{
		initData();
		document.getElementById("start").style.display="none";
		bstart=1;
		createTetris();
		setNeedDisPlay();

		document.addEventListener("keydown",onkeydown);

		timer = setInterval(ontimer,speed);
	}

	function ontimer()
	{
		if(canDown())
		{
			onDown();
			setNeedDisPlay();
		}
		else {
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

	function onkeydown(event)
	{
		if(gameOver)
			return;

		if(event.keyCode == 27)
		{
			window.close();
		}
		// 下
		if (event.keyCode == 40) 
		{
			onDown();
			setNeedDisPlay();
		}
		// 上
		else if(event.keyCode == 38) 
		{
			onRotate();
			setNeedDisPlay();

		}
		// left
		else if(event.keyCode == 37) 
		{
			onLeft();
			setNeedDisPlay();
		}
		// right
		else if( event.keyCode == 39) 
		{
			onRight();
			setNeedDisPlay();
		}
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
    	if (canDown()) {
        	currentBoxPoint.y++;
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
	                var pt = {x:currentBoxPoint.x + j + 1, y:currentBoxPoint.y + i};
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
