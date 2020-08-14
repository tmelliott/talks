FILE = index

default: $(FILE).html

$(FILE).html: $(FILE).Rmd
	Rscript -e "rmarkdown::render(\"$^\")"

clean:
	@rm $(FILE).html

install:
	@Rscript -e "utils::install.packages(c('sass', 'rmarkdown', 'revealjs', 'RSQLite', 'dbplyr', 'dplyr', 'magrittr', 'ggplot2', 'geosphere', 'patchwork', 'ggrepel', 'truncnorm', 'viridis'))"