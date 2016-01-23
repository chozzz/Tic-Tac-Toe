Array.prototype.allValuesSame = function() {
    for(var i = 1; i < this.length; i++)
        if(this[i] !== this[0])
            return false;
    return true;
}

Array.prototype.countValuesOf = function(val) {
    var res = 0;
    for (var i = 0; i < this.length; i++)
        if (this[i] === val) res++;

    return res;
}

var AI = {
    getDangerousZone: function() {
        var dRes = Game.getDiagonalResult();
        for (var i = 0; i < dRes.length; i++)
        {
            var myTotal = dRes[i].countValuesOf('O');
            var playerTotal = dRes[i].countValuesOf('X');
            var emptyCellIndex = $.inArray('', dRes[i]);
            if (myTotal == 0 && dRes[i].length - playerTotal == 1)
            {
                if (i === 0)
                    return [emptyCellIndex, emptyCellIndex];
                else if (i === 1)
                    return [emptyCellIndex, dRes[i].length - emptyCellIndex - 1];
            }
        }
        
        var vRes = Game.getVerticalResult();
        for (var i = 0; i < vRes.length; i++)
        {
            var myTotal = vRes[i].countValuesOf('O');
            var playerTotal = vRes[i].countValuesOf('X');
            var emptyCellIndex = $.inArray('', vRes[i]);
            if (myTotal == 0 && vRes[i].length - playerTotal == 1)
                return [emptyCellIndex, i];
        }
        
        var hRes = Game.getHorizontalResult();
        for (var i = 0; i < hRes.length; i++)
        {
            var myTotal = hRes[i].countValuesOf('O');
            var playerTotal = hRes[i].countValuesOf('X');
            var emptyCellIndex = $.inArray('', hRes[i]);
            if (myTotal == 0 && hRes[i].length - playerTotal == 1)
                return [i, emptyCellIndex];
        }
        
        return null;
    },

    getAdvantageousZone: function() {
        var vRes = Game.getVerticalResult();
        var hRes = Game.getHorizontalResult();
        // Start of vertical and horizontal heuristic analysis.
        // Find which array index that contains Player, and not Computer that has empty space for both Vertical and Horizontal.
        // And return the only first one happening.
        var vArrIdx = [];
        var hArrIdx = [];
        for (var i = 0; i < vRes.length; i++)
        {
            var myTotal = vRes[i].countValuesOf('O');
            var playerTotal = vRes[i].countValuesOf('X');
            var emptyCellIndex = $.inArray('', vRes[i]);
            if (myTotal == 0 && playerTotal > 0)
                vArrIdx.push(i);
        }
        for (var i = 0; i < hRes.length; i++)
        {
            var myTotal = hRes[i].countValuesOf('O');
            var playerTotal = hRes[i].countValuesOf('X');
            var emptyCellIndex = $.inArray('', hRes[i]);
            if (myTotal == 0 && playerTotal > 0)
                hArrIdx.push(i);
        }
        
        for (var i = 0; i < vArrIdx.length; i++)
        {
            if ( $.inArray(vArrIdx[i], hArrIdx) !== false ) {
                var res = [];
                $('#boardTbl td:not(.selected)').each(function(){
                    if ($(this).data('col') == vArrIdx[i]){
                        res.push ( [$(this).data('row'), $(this).data('col')] );
                    }
                });
                if (res.length > 0) {
                    var randomIndex = Math.floor(Math.random() * res.length);
                    return res[randomIndex];
                }
            }
        }
        // End of vertical and horizontal heuristic analysis.
        return null;
    },
    
    getWinningZoneBy: function(numOfTurn) {
        var dRes = Game.getDiagonalResult();
        for (var i = 0; i < dRes.length; i++) 
        {
            var myTotal = dRes[i].countValuesOf('O');
            var playerTotal = dRes[i].countValuesOf('X');
            var emptyCellIndex = $.inArray('', dRes[i]);

            if (playerTotal == 0 && dRes[i].length - myTotal == numOfTurn)
            {
                if (i === 0)
                    return [emptyCellIndex, emptyCellIndex];
                else if (i === 1)
                    return [emptyCellIndex, dRes[i].length - emptyCellIndex - 1];
            }
        }

        var vRes = Game.getVerticalResult();
        for (var i = 0; i < vRes.length; i++)
        {
            var myTotal = vRes[i].countValuesOf('O');
            var playerTotal = vRes[i].countValuesOf('X');
            var emptyCellIndex = $.inArray('', vRes[i]);
            if (playerTotal == 0 && vRes[i].length - myTotal == numOfTurn)
                return [emptyCellIndex, i];
        }

        var hRes = Game.getHorizontalResult();
        for (var i = 0; i < hRes.length; i++)
        {
            var myTotal = hRes[i].countValuesOf('O');
            var playerTotal = hRes[i].countValuesOf('X');
            var emptyCellIndex = $.inArray('', hRes[i]);
            if (playerTotal == 0 && hRes[i].length - myTotal == numOfTurn)
                return [i, emptyCellIndex];
        }

        return null;
    },

    getCellOn: function(x, y) {
        return $('#boardTbl > tr').eq(x).children('td').eq(y);
    },

    getRandomNotSelectedCell: function() {
        var $notSelectedCells = $('#boardTbl td:not(.selected)');
        var randomIndex = Math.floor(Math.random() * $notSelectedCells.length);
        return $notSelectedCells.eq(randomIndex);
    },

    getRandomCornerCell: function() {
        var $notSelectedCornerCells = $('#boardTbl td.corner:not(.selected)');
        if ($notSelectedCornerCells.length > 0) {
            var randomIndex = Math.floor(Math.random() * $notSelectedCornerCells.length);
            return $notSelectedCornerCells.eq(randomIndex);
        }
        return null;
    },

    getMidCell: function() {
        if (Game.totalRows % 2 == 1)
        {
            var midCell = Math.floor(Game.totalRows / 2);
            return this.getCellOn(midCell, midCell);
        }
        return null;
    },

    countCornersOwnedBy: function(mark) {
        var res = 0;
        $('#boardTbl td.corner.selected').each(function(){
            if ($(this).text() === mark) res++;
        });
        return res;
    },
    
    getRandomNotCornerCell: function() {
        var res = [];
        $("#boardTbl td:not(.corner):not(.selected)").each(function() {
            res.push($(this));
        });
        if (res.length > 0) {
            var randomIndex = Math.floor(Math.random() * res.length);
            return res[randomIndex];
        }
        else return null;
    },
    
    checkIfMarkExistOnCol: function(mark, col) {
        var vRes = Game.getVerticalResult();
        return vRes[col].countValuesOf(mark) > 0 ? true : false;
    },
    
    checkIfMarkExistOnRow: function(mark, row) {
        var hRes = Game.getHorizontalResult();
        return hRes[row].countValuesOf(mark) > 0 ? true : false;
    },
    
    getNotSelectedCornerIntersectedCellBy: function(mark) {
        var res = null;
        var $notSelectedCornerCells = $('#boardTbl td.corner:not(.selected)');
        if ($notSelectedCornerCells.length > 0) {
            $notSelectedCornerCells.each(function() {
                var dataCol = $(this).data('col');
                var dataRow = $(this).data('row');
                if (AI.checkIfMarkExistOnCol(mark, dataCol) && AI.checkIfMarkExistOnRow(mark, dataRow)) {
                    res = $(this);
                }
            });
        }
        return res;
    },

    run: function() {
        var $selectedCell = null;
        
        var recommendedZone = AI.getWinningZoneBy(1) || AI.getDangerousZone();
        if (recommendedZone != null)
        {
            $selectedCell = AI.getCellOn(recommendedZone[0], recommendedZone[1]);
        }
        else
        {
            var $midCell = this.getMidCell();
            if ($midCell != null && $midCell.text() === '')
            {
                $selectedCell = $midCell;
            }
            else if ($midCell != null && $midCell.text() === 'O')
            {
                var totalPlayerCorner = AI.countCornersOwnedBy('X');
                if (Game.currentMove <= 4 && totalPlayerCorner == 1) {
                    // Get the corner where player mark intersects.
                    $selectedCell = AI.getNotSelectedCornerIntersectedCellBy('X');
                }
                else if (Game.currentMove <= 4 && totalPlayerCorner == 2) {
                    // Get the not corner.
                    $selectedCell = AI.getRandomNotCornerCell();
                }
                else {
                    recommendedZone = AI.getAdvantageousZone();
                    if (recommendedZone != null)
                        $selectedCell = AI.getCellOn(recommendedZone[0], recommendedZone[1]);
                    else
                        $selectedCell = AI.getRandomNotCornerCell() || AI.getRandomCornerCell();
                }
            }
            else
            {
                if (Game.currentMove >= Game.totalRows * 2)
                {
                    recommendedZone = AI.getAdvantageousZone();
                    if (recommendedZone != null)
                        $selectedCell = AI.getCellOn(recommendedZone[0], recommendedZone[1]);
                    else {
                        $cornerCell = AI.getRandomCornerCell();
                        $selectedCell = $cornerCell != null ? $cornerCell : AI.getRandomNotSelectedCell();
                    }
                }
                else
                {
                    $cornerCell = AI.getRandomCornerCell();
                    $selectedCell = $cornerCell != null ? $cornerCell : AI.getRandomNotSelectedCell();
                }
            }
        }
        
        if ($selectedCell == null)
        {
            console.log('This should not be happening !');
        }
        Game.select($selectedCell, 'O');
        Game.currentMove++;
    },
};

var Game = {
    currentMove: 1,
    totalRows: 3,
    isRunning: false,
    
    createBoard: function() {
        // Empty the current board.
        $('#boardTbl').empty();
        
        // Creating the table cells.
        for (var x = 0; x < this.totalRows; x++)
        {
            var tblRow = $("<tr>").attr('id', 'row_'+x);
            for (var y = 0; y < this.totalRows; y++)
            {
                var tblCol = $("<td class='selected'>").data('row', x).data('col', y);
                // Check if corner cell.
                if ((x == 0 && y == 0) || (x == 0 && y == this.totalRows - 1) || 
                    (x == this.totalRows - 1 && y == 0) || 
                    (x == this.totalRows - 1 && y == this.totalRows - 1))
                    tblCol.addClass('corner');

                tblRow.append(tblCol);
            }
            $('#boardTbl').append(tblRow);
        }
    },
    
    select: function(cell, mark) {
        cell.addClass('selected').text(mark).data('move', Game.currentMove);
        cell.off('click');
        var res = Game.checkWinner();
        if (res !== false)
        {
            if (res == 'O') alert ('Computer wins !');
            else if (res == 'X')  alert ('Player wins !');
            Game.stop();
            /*if (res == 'X') {
                Game.isRunning = false;
                console.log ('Player wins !');
                Game.stop();
            }
            else if (res == 'O') {
                Game.stop();
                console.log ('Computer wins !');
                Game.start();
            }*/
            
        }
        else if (Game.isTie())
        {
            alert('Tie');
            Game.stop();
            /*console.log('Tie');
            Game.stop();
            Game.start();*/
        }
    },
    
    start: function() {
        Game.isRunning = true;
        Game.currentMove = 1;
        $('#replayBtn').hide();
        
        $('#boardTbl td').removeClass('selected win').text('')
        /*.removeData('move');
        while(Game.isRunning) {
            $selectCell = AI.getRandomNotSelectedCell();;
            Game.select( $selectCell, 'X' );
            Game.currentMove++;
            if (Game.isRunning)
                AI.run();
        }
        */
        // Attaching the event handlers to every single table cells.
        .one('click', function(){
            Game.select( $(this), 'X' );
            Game.currentMove++;
            if (Game.isRunning)
                AI.run();
        });
    },
    
    stop: function() {
        Game.isRunning = false;
        $('#boardTbl td').addClass('selected').off('click');
        $('#replayBtn').show();
    },
    
    isTie: function() {
        return $('#boardTbl td:not(.selected)').length == 0;
    },
    
    checkWinner: function() {
        // Check all horizontal lines
        var hRes = Game.getHorizontalResult();
        for (var r = 0; r < this.totalRows; r++)
        {
            var val = hRes[r][0];
            if (val != "" && hRes[r].allValuesSame()){
                $('#boardTbl tr').eq(r).children('td').addClass('win');
                return val;
            }
        }
        
        // Check all vertical lines
        var vRes = Game.getVerticalResult();
        for (var c = 0; c < this.totalRows; c++)
        {
            var val = vRes[c][0];
            if (val != "" && vRes[c].allValuesSame()){
                $('#boardTbl tr').each(function(){
                    $(this).children('td').eq(c).addClass('win');
                });
                return val;
            }
        }
        
        // Check all diagonal lines.
        var dRes = Game.getDiagonalResult();
        for (var i = 0; i < dRes.length; i++)
        {
            var val = dRes[i][0];
            if (val != "" && dRes[i].allValuesSame()) {
                if (i == 0) {
                    var idx = 0;
                    $('#boardTbl tr').each(function(){
                        $(this).children('td').eq(idx++).addClass('win');
                    });
                }
                else if (i == 1) {
                    var idx = Game.totalRows - 1;
                    $('#boardTbl tr').each(function(){
                        $(this).children('td').eq(idx--).addClass('win');
                    });
                }
                return val;
            }
        }
        
        return false;
    },
    
    getDiagonalResult: function() {
        var diagonalVals = [];
        
        var dArr1 = [];
        for (var i = 0; i < this.totalRows; i++)
        {
            var text = $('#boardTbl tr').eq(i).children('td').eq(i).text();
            dArr1.push(text);
        }
        
        var dArr2 = [];
        for (var i = 0, x = this.totalRows - 1; x >= 0; x--)
        {
            var text = $('#boardTbl tr').eq(i++).children('td').eq(x).text();
            dArr2.push(text);
        }
        
        diagonalVals.push(dArr1);
        diagonalVals.push(dArr2);
        return diagonalVals;
    },
    
    getHorizontalResult: function() {
        var horizontalVals = [];
        for (var r = 0; r < this.totalRows; r++)
        {
            var rowArr = [];
            for (var c = 0; c < this.totalRows; c++)
            {
                var text = $('#boardTbl tr').eq(r).children('td').eq(c).text();
                rowArr.push(text);
            }
            horizontalVals.push(rowArr);
        }
        return horizontalVals;
    },
    
    getVerticalResult: function() {
        var verticalVals = [];
        for (var r = 0; r < this.totalRows; r++)
        {
            var colArr = [];
            for (var c = 0; c < this.totalRows; c++)
            {
                var text = $('#boardTbl tr').eq(c).children('td').eq(r).text();
                colArr.push(text);
            }
            verticalVals.push(colArr);
        }
        return verticalVals;
    },
};

function initPreGame()
{
    var requestedRows = parseInt($("#rowsCount").val());
    if ((isNaN(requestedRows)) || (requestedRows < 3 || requestedRows > 9))
    {
        alert("Requested row is set to '3' by default.");
        Game.totalRows = 3;
    }
    else
    {
        Game.totalRows = requestedRows;
    }
    $('#game').show();
    Game.createBoard();
    Game.start();
}

$(function(){
    //initPreGame();

    $('#preModal').on('hidden.bs.modal', function () {
        initPreGame();
    }).modal({
        keyboard: false
    });
    
    $('#game').hide();
    
    $("#goBtn").on('click', function(ev) {
        $("#preModal").modal('hide');
        ev.preventDefault();
    });

    $("#replayBtn").on('click', function(ev) {
        Game.start();
    });
});
