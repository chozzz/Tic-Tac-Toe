Array.prototype.allValuesSame = function() {
    for(var i = 1; i < this.length; i++)
    {
        if(this[i] !== this[0])
            return false;
    }
    return true;
}

Array.prototype.countValuesOf = function(val) {
    var res = 0;
    for (var i = 0; i < this.length; i++)
    {
        if (this[i] === val) res++;
    }
    return res;
}

var AI = {
    test: function(elem, index, arr) {
        if ($.inArray('O', elem) === -1)
        {
            var total = elem.countValuesOf('X');
            if (elem.length - total <= 1) {
                console.log(elem);
                return elem;
            }
        }
    },
    
    getDangerousCell: function() {
        var res = null;
        
        var dRes = Game.getDiagonalResult();
        for (var i = 0; i < dRes.length; i++)
        {
            var myTotal = dRes[i].countValuesOf('O');
            var playerTotal = dRes[i].countValuesOf('X');
            if (myTotal == 0 && dRes[i].length - playerTotal <= 1)
            {
                var emptyCellIndex = $.inArray('', dRes[i]);
                if (i === 0)
                {
                    res = [emptyCellIndex, emptyCellIndex];
                    break;
                }
                else if (i === 1)
                {
                    res = [emptyCellIndex, dRes[i].length - emptyCellIndex - 1];
                    break;
                }
            }
        }
        if (res != null) return res;
        
        var vRes = Game.getVerticalResult();
        for (var i = 0; i < vRes.length; i++)
        {
            var myTotal = vRes[i].countValuesOf('O');
            var playerTotal = vRes[i].countValuesOf('X');
            if (myTotal == 0 && vRes[i].length - playerTotal <= 1)
            {
                var emptyCellIndex = $.inArray('', vRes[i]);
                res = [emptyCellIndex, i];
                break;
            }
        }
        if (res != null) return res;
        
        var hRes = Game.getHorizontalResult();
        for (var i = 0; i < hRes.length; i++)
        {
            var myTotal = hRes[i].countValuesOf('O');
            var playerTotal = hRes[i].countValuesOf('X');
            if (myTotal == 0 && hRes[i].length - playerTotal <= 1)
            {
                var emptyCellIndex = $.inArray('', hRes[i]);
                res = [i, emptyCellIndex];
                break;
            }
        }
        
        return res;
    },
    
    getCellOn: function(x, y) {
        return $('#boardTbl > tr').eq(x).children('td').eq(y);
    },
    
    getRandomNotSelectedCell: function() {
        var $notSelectedCells = $('#boardTbl td:not(.selected)');
        var randomIndex = Math.floor(Math.random() * $notSelectedCells.length);
        return $notSelectedCells.eq(randomIndex);
    },
    
    run: function() {
        var dangerZone = AI.getDangerousCell();
        console.log('danger zone: ' + dangerZone);
        var $selectedCell = dangerZone == null ? AI.getRandomNotSelectedCell() : AI.getCellOn(dangerZone[0], dangerZone[1]);
        
        console.log('final cell: ' + ($selectedCell.data('row') - 1) + ' - ' + ($selectedCell.data('col') - 1 ));
        
        Game.select($selectedCell, 'O');
        Game.currentMove++;
    },
};

var Game = {
    currentMove: 1,
    totalRows: 3,
    isRunning: false,
    
    createBoard: function() {
        'use strict';
        // Empty the current board.
        $('#boardTbl').empty();
        
        // Creating the table cells.
        for (let r = 1; r <= this.totalRows; r++)
        {
            var tblRow = $("<tr>").attr('id', 'row_'+r);
            for (let c = 1; c <= this.totalRows; c++)
            {
                var tblCol = $("<td class='selected'>").data('row', r).data('col', c);
                tblRow.append(tblCol);
            }
            $('#boardTbl').append(tblRow);
        }
    },
    
    select: function(cell, mark) {
        cell.addClass('selected').text(mark);
        cell.off('click');
        var res = Game.checkWinner();
        if (res !== false)
        {
            if (res == 'O')
            {
                alert ('Computer wins !');
            }
            else if (res == 'X')
            {
                alert ('Player wins !');
            }
            Game.stop();
        }
        else if (Game.isTie())
        {
            alert('Tie');
            Game.stop();
        }
    },
    
    start: function() {
        Game.isRunning = true;
        Game.currentMove = 1;
        $('#replayBtn').hide();
        
        $('#boardTbl td').removeClass('selected').text('')
        // Attaching the event handlers to every single table cells.
        .one('click', function(){
            //var text = Game.currentMove++ % 2 ? 'X' : 'O';
            Game.select( $(this), 'X' );
            if (Game.isRunning) {
                AI.run();
                Game.currentMove++;
            }
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
        'use strict';
        // Check all horizontal lines
        let hRes = Game.getHorizontalResult();
        for (let r = 0; r < this.totalRows; r++)
        {
            let val = hRes[r][0];
            if (val != "" && hRes[r].allValuesSame())
            {
                console.log("'" + val + "' is the winner horizontally.");
                return val;
            }
        }
        
        // Check all vertical lines
        let vRes = Game.getVerticalResult();
        for (let c = 0; c < this.totalRows; c++)
        {
            let val = vRes[c][0];
            if (val != "" && vRes[c].allValuesSame())
            {
                console.log("'" + val + "' is the winner vertically.");
                return val;
            }
        }
        
        // Check all diagonal lines.
        let dRes = Game.getDiagonalResult();
        for (let i = 0; i < dRes.length; i++)
        {
            let val = dRes[i][0];
            if (val != "" && dRes[i].allValuesSame())
            {
                console.log("'" + val + "' is the winner diagonally.");
                return val;
            }
        }
        
        return false;
    },
    
    getDiagonalResult: function() {
        'use strict';
        let diagonalVals = [];
        
        let dArr1 = [];
        for (let i = 0; i < this.totalRows; i++)
        {
            let text = $('#boardTbl tr').eq(i).children('td').eq(i).text();
            dArr1.push(text);
        }
        
        let dArr2 = [];
        for (let i = 0, x = this.totalRows - 1; x >= 0; x--)
        {
            let text = $('#boardTbl tr').eq(i++).children('td').eq(x).text();
            dArr2.push(text);
        }
        
        diagonalVals.push(dArr1);
        diagonalVals.push(dArr2);
        return diagonalVals;
    },
    
    getHorizontalResult: function() {
        'use strict';
        let horizontalVals = [];
        for (let r = 0; r < this.totalRows; r++)
        {
            let rowArr = [];
            for (let c = 0; c < this.totalRows; c++)
            {
                let text = $('#boardTbl tr').eq(r).children('td').eq(c).text();
                rowArr.push(text);
            }
            horizontalVals.push(rowArr);
        }
        return horizontalVals;
    },
    
    getVerticalResult: function() {
        'use strict';
        let verticalVals = [];
        for (let r = 0; r < this.totalRows; r++)
        {
            let colArr = [];
            for (let c = 0; c < this.totalRows; c++)
            {
                let text = $('#boardTbl tr').eq(c).children('td').eq(r).text();
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
    initPreGame();
    /*
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
    */
    $("#replayBtn").on('click', function(ev) {
        Game.start();
    });
});
