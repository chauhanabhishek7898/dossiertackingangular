// Import the core angular services.
import { Component, Input } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "app-scroll-on-mouseenter",
	styles: [
		`
			:host {
				display: block ;
				overflow: hidden ;
				transition:0.5s all ease-in-out;
			}
			.wrapper {
                width: 100%;
                padding: 0 10px;
			}
			:host:hover {
				overflow: auto ;
				overscroll-behavior: contain ;
				transition:0.5s all ease-in-out;
				
			}
			:host:hover .wrapper {
				width: 100% ;
				transition:0.5s all ease-in-out;
			}
		`
	],
	template:
	`
		<div class="wrapper">
			<ng-content></ng-content>
		</div>
	`
})
export class ScrollOnMouseenterComponent {
	@Input() scrollToBottom = true;
	// ....
}