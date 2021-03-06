import { Router } from '@angular/router';
import { ConfigParams } from "./../../shared/models/config-params";
import { debounceTime } from 'rxjs/operators'
import { FormBuilder, FormGroup } from "@angular/forms";
import { Movie } from "./../../shared/models/Movie";
import { FilmsService } from "./../../core/films.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "dio-listagem-filmes",
  templateUrl: "./listagem-filmes.component.html",
  styleUrls: ["./listagem-filmes.component.scss"],
})
export class ListagemFilmesComponent implements OnInit {
  readonly noPhoto =
    "https://termoparts.com.br/wp-content/uploads/2017/10/no-image.jpg";

  filter: FormGroup;
  genders: Array<string>;
  movies: Movie[] = [];
  config: ConfigParams = {
    page: 0,
    limit: 4,
  };

  constructor(
    private service: FilmsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listMovies();
    this.createForm();

    this.genders = [
      "Ação",
      "Romance",
      "Aventura",
      "Terror",
      "Ficção Científica",
      "Comédia",
      "Drama",
    ];
  }

  createForm() {
    this.filter = this.formBuilder.group({
      text: [null],
      gender: [null],
    });

    this.filter.get("text").valueChanges.pipe(debounceTime(400)).subscribe((value: string) => {
      this.config.search = value;
      this.resetConsulta();
    });

    this.filter.get("gender").valueChanges.pipe(debounceTime(400)).subscribe((val: string) => {
      this.config.field = { type: "gender", value: val };
      this.resetConsulta();
    });
  }

  onScroll(): void {
    this.listMovies();
  }

  
  cleanForm() {
    this.service.getAllWithoutFilter().subscribe(res => this.movies = res)
  }

  viewMovie(id: number): void  {
    this.router.navigateByUrl('/filmes/' + id)
  }

   listMovies() {
    this.config.page++;
    this.service
      .getAll(this.config)
      .subscribe((movies: Movie[]) => {
        this.movies.push(...movies)
      });
  }

  private resetConsulta(): void {
    this.config.page = 0;
    this.movies = [];
    this.listMovies();
  }
}
