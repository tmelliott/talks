FILE = index

default: $(FILE).html

$(FILE).html: $(FILE).html.tmp
	cp $< $@

$(FILE).html.tmp: $(FILE).Rmd
	@Rscript -e "rmarkdown::render('$^', output_file = '$@')"

clean:
	@rm $(FILE).html
