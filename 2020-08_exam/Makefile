FILE = index

default: $(FILE).html

$(FILE).html: $(FILE).Rmd
	Rscript -e "rmarkdown::render(\"$^\")"

clean:
	@rm $(FILE).html

install:
	@Rscript -e "utils::install.packages(c('rmarkdown', 'revealjs', 'RSQLite', 'dbplyr'))"