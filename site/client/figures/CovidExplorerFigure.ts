import { CovidDataExplorer } from "charts/covidDataExplorer/CovidDataExplorer"
import { covidDashboardSlug } from "charts/covidDataExplorer/CovidConstants"
import { excludeUndefined } from "charts/Util"

import { Figure, LoadProps } from "./Figure"
import { splitURLintoPathAndQueryString } from "utils/client/url"

interface CovidExplorerFigureProps {
    queryStr?: string
    container: HTMLElement
}

export class CovidExplorerFigure implements Figure {
    private props: CovidExplorerFigureProps
    constructor(props: CovidExplorerFigureProps) {
        this.props = props
    }

    private _isLoaded: boolean = false

    get isLoaded() {
        return this._isLoaded
    }

    get hasPreview() {
        return false
    }

    get container() {
        return this.props.container
    }

    get boundingRect() {
        return this.container.getBoundingClientRect()
    }

    async load(loadProps: LoadProps) {
        if (!this._isLoaded) {
            this._isLoaded = true
            CovidDataExplorer.bootstrap({
                containerNode: this.container,
                isEmbed: true,
                queryStr: this.props.queryStr,
                globalEntitySelection: loadProps.globalEntitySelection
            })
        }
    }

    static figuresFromDOM(
        container: HTMLElement | Document = document
    ): CovidExplorerFigure[] {
        const elements = Array.from(
            container.querySelectorAll<HTMLElement>("*[data-explorer-src]")
        )
        return excludeUndefined(
            elements.map(element => {
                const dataSrc = element.getAttribute("data-explorer-src")
                if (!dataSrc) return undefined
                const {
                    path: explorerUrl,
                    queryString: queryStr
                } = splitURLintoPathAndQueryString(dataSrc)
                if (!explorerUrl.includes(covidDashboardSlug)) return undefined
                return new CovidExplorerFigure({
                    queryStr,
                    container: element
                })
            })
        )
    }
}
