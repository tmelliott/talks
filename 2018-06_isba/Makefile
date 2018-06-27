FILE=poster
SECTIONS=$(wildcard sections/*.Rnw)

target: $(FILE).pdf
.PHONY: clean

$(FILE).pdf: $(FILE).tex
	@latexmk -pdf $<

$(FILE).tex: $(FILE).Rnw $(SECTIONS)
	@R --slave -e "knitr::knit('$<')"

clean:
	@latexmk -pdf -C $(FILE).tex
	@rm $(FILE).tex