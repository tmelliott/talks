FILE = travel_times_and_bus_prediction

default: $(FILE).html

$(FILE).html: $(FILE).Rmd
	@Rscript -e "rmarkdown::render(\"$^\")"

clean:
	@rm $(FILE).html
