module.exports =
class LineTailManager

  change: true
  lineTails: {}
  lineTailsGroupByLines: {}

  isHide: false
  editor: null

  constructor: (@editor) ->

  lineTailAddByLine: (message) ->
    row = message.range.start.row
    column = message.range.start.column
    
    if @lineTailsGroupByLines.hasOwnProperty row
      @lineTailsGroupByLines[row].push message
      @lineTailsGroupByLines[row] = @lineTailsGroupByLines[row].sort (a, b) => @sortLogic(a, b)
    else
      @lineTailsGroupByLines[row] = []
      @lineTailsGroupByLines[row].push message

  lineTailDeleteByLine: (message) ->
    row = message.range.start.row
    column = message.range.start.column
    return unless @lineTailsGroupByLines.hasOwnProperty row
    @lineTailsGroupByLines[row] = @lineTailsGroupByLines[row].filter (a) ->
      if a.key is message.key
        return false
      else
        return true
    @lineTailsGroupByLines[row] = @lineTailsGroupByLines[row].sort (a, b) => @sortLogic(a, b)

  sortLogic: (a, b) ->
    a_num = a.range.start.column
    b_num = b.range.start.column

    if a.class is 'error'
      a_num = a_num + 100000
    else if a.class is 'warning'
      a_num = a_num + 10000
    else if a.class is 'info'
      a_num = a_num + 1000

    if b.class is 'error'
      b_num = b_num + 100000
    else if b.class is 'warning'
      b_num = b_num + 10000
    else if b.class is 'info'
      b_num = b_num + 1000

    a_num < b_num

  lineTailIndicatorAdd: (message) ->
    return if @lineTails.hasOwnProperty message.key
    @lineTails[message.key] = message
    @lineTailAddByLine message

  lineTailIndicatorDelete: (message) ->
    return unless @lineTails.hasOwnProperty message.key
    @lineTailDeleteByLine message
    delete @lineTails[message.key]

  getTextByLine: (line) ->
    return null if @isHide

    if @lineTailsGroupByLines[line] and @lineTailsGroupByLines[line].length > 0
      item = @findFirst line, @editor.getPath()
      if item
        return {text: item.text, tipClass: item.tipClass}
      else
        return null
    else
      return null

  findFirst: (line, path) ->
    item = @lineTailsGroupByLines[line].find (a) ->
      if a.filePath is path
        return true
      return false
    return item

  isChanged: ->
    @change

  setChange: (@change) ->

  setHide: (@isHide) ->

