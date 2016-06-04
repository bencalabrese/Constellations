# Utility to parse text from conwaylife.com .cells files

def parse_live_cells(lines)
  live_cells = []
  height = 0
  width = 0

  lines.each_with_index do |line, col|
    line.split("").each_with_index do |cell, row|
      if cell == "O"
        live_cells << [row + 1, col + 1]
        width = row if row > width
        height = col if col > height
      end
    end
  end

  height += 3
  width += 3

  live_cells.map! { |cell| "    " + cell.to_s }
  deltas = live_cells.join(",\n")

  "  height: #{height},\n  width: #{width},\n  liveCellDeltas: [\n#{deltas}\n  ]"
end

lines = File.readlines(File.join(File.dirname(__FILE__), 'cell_map.txt'))

lines.reject! { |line| line[0] == "!" }
lines.map!(&:chomp)

File.open(File.join(File.dirname(__FILE__), 'output.txt'), "w") do |f|
  f.write parse_live_cells(lines)
end
