FILE = index
out = tom_elliott

default: $(out).pdf

$(out).pdf: $(FILE).Rmd
	@Rscript -e "rmarkdown::render('$^', output_file = '$@')"

clean:
	@rm $(FILE).pdf
