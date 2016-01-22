Array.prototype.allValuesSame = function() {
    for(var i = 1; i < this.length; i++)
    {
        if(this[i] !== this[0])
            return false;
    }
    return true;
}

var AI = {
    
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
    
    start: function() {
        Game.isRunning = true;
        $('#boardTbl td').removeClass('selected')
        // Attaching the event handlers to every single table cells.
        .one('click', function(){
            var text = Game.currentMove++ % 2 ? 'X' : 'O';
            $(this).addClass('selected').text(text);
            var res = Game.checkWinner();
            if (res !== false)
            {
                Game.stop();
            }
        });
    },
    
    stop: function() {
        Game.isRunning = false;
        $('#boardTbl td').addClass('selected').off('click');
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
    
    /*
    initPreGame();
    */
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
});
