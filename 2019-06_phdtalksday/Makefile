FILE = index

default: $(FILE).html

$(FILE).html: $(FILE).Rmd
	@Rscript -e "rmarkdown::render(\"$^\")"

clean:
	@rm $(FILE).html
