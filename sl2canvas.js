// Class for parsing and analyzing the diagram given in SL format
class GoDiagram {
  /**
   * Constructor of GoDiagram class
   * @param {String} content - String containing the diagram in SL syntax
   */
  constructor(content) {
    // in the original php, these varible declarations were protected class variables

    // misc
    this.content;         // raw copy of diagram contents (single string)
    this.linkmap;         // array of imagemap links (bracketlinks)
    this.specialMarkup;	// special markup inside curly brackets
    this.dim;		// holds DiagramDimensions

    // values extracted from the title line
    this.firstColor;	// 'B' or 'W'
    this.coordinates;	// boolean
    this.boardSize;	// integer (from title line)
    this.title;		// raw text of title
    this.startMoveNum;	// starting move number for moves in diagram

    // goban properties
    this.goban;		// board (string) without borders
    this.width;		// actual width
    this.height;          // actual height
    this.coordx;          // X offset for coordinate numbering
    this.coordy;          // Y offset for coordinate numbering
    this.moves;
    this.markup;

    // borders (1 or 0)
    this.topborder;
    this.bottomborder;
    this.leftborder;
    this.rightborder;

    content = content.split(/\n/);

    var linenum = 0;

    this.parseTitle(content[linenum++]);
    this.parseDiagram(content,linenum)

  }

  /**
   * Returns true, if the diagram is a valid diagram, false otherwise.
   * @return {Boolean}
   */
  isValid()
  {
    return (this.content != null);
  }

  /**
   * Parse the parameters of the first line
   * @param {String} title - First line of diagram
   */
  parseTitle(title)
  {
    var title_regex = /^(?:\s*)*\$\$([WB])?(c)?(\d+)?(?:m(\d+))?(.*)/
    var parsed_title = title.match(title_regex);
    this.firstColor = (parsed_title[1] == 'W') ? 'W' : 'B';
    this.coordinates = !(parsed_title[2] === undefined);
    this.boardSize = parsed_title[3] === undefined ? 19 : parseInt(parsed_title[3]);
    this.startMoveNum = parsed_title[4] ? parseInt(parsed_title[4]) : 1;
    this.title = parsed_title[5].trim();
  }

  /**
   * Parse diagram within content/linenum framework
   * @param {Array} content - Array of diagram lines
   * @param {Number} linenum - Current offset into array
   */
   parseDiagram(content, linenum)
   {
     this.content = '';
     this.linkmap = {};
     this.specialMarkup = [];

     console.log(content[linenum]);
     content[linenum].match(/^(\s*)*\$\$/) !== null

     // There are lines in the array that begin with $$
     while (linenum < content.length && content[linenum].match(/^(\s*)*\$\$/) !== null)
     {
       // match non-link lines and add them to this.content
       var match = content[linenum].match(/^(?:\s*)*\$\$\s*([^{[\s].*)/)
       if ( match !== null)
         this.content += match[1] + "\n";

       // match lines with links in the form [anchor|link] and add them to the linkmap
       match = content[linenum].match(/^(?:\s*)*\$\$\s*\[(.*)\|(.*)\]/)
       if ( match !== null)
       {
         var anchor = match[1].trim();
         if (anchor.match(/^[a-z0-9WB@#CSTQYZPM]$/) !== null)
           this.linkmap[anchor] = match[2].trim();
       }

       // match lines surrounded in { }
       // these are used for arrows and lines
       match = content[linenum].match(/^(?:\s*)*\$\$\s*{(.*)}/)
       if (match !== null)
         this.specialMarkup.push(trim(match[1]));
       linenum++;
     }
   }
}

//Test code
var diagramsrc = `$$B The ear-reddening move
$$  ---------------------------------------
$$ | . . . . . . . . . X O O . . . . . . . |
$$ | . . . X . . . . . X O . O . O O X . . |
$$ | . . O O . X . . O X X O O . O X . . . |
$$ | . . . , . . . . . , . X X X . , X . . |
$$ | . . . . . X . . . . X . . . . X X . . |
$$ | . . O . . . . . . . . . . . . X O O . |
$$ | . . . . . . . . . . . . . O O O X X X |
$$ | . . . . . . . . . . . . . . X O O O X |
$$ | . . . . . . . . . 1 . . X O O X X X . |
$$ | . . . , . . . . . , . . O O X , X O . |
$$ | . . O . . . . . . . . . . . O X X O . |
$$ | . . . . . . . . . . . . . . O X O X . |
$$ | . . . . . . . . . . . . O . O X O O . |
$$ | . . O . . . . . . X . X O . O X . . . |
$$ | . . . . . . X . W . . X O X O X O . . |
$$ | . . X , X . . X . , . X O O X O O . . |
$$ | . . . . . X O X O . O O X X X X O O . |
$$ | . . . . . . X O . O O . O X X . X O . |
$$ | . . . . . . . . O . . O . X . X . X . |
$$  ---------------------------------------
$$ [1|http://senseis.xmp.net/?EarReddeningMove]`;
var diagram = new GoDiagram(diagramsrc);
console.log(diagram);
