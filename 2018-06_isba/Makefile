FILE=poster

target: $(FILE).pdf
.PHONY: clean

$(FILE).pdf: $(FILE).tex
	@latexmk -pdf $<

$(FILE).tex: $(FILE).Rnw
	@R --slave -e "knitr::knit('$<')"

clean:
	@latexmk -pdf -C $(FILE).tex
	@rm $(FILE).tex