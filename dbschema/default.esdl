module default {

    scalar type Text extending str {
        constraint min_len_value(2);
        constraint expression on (__subject__ = str_trim(__subject__));
    }

    scalar type Unit extending enum<KG,GR,STUK,FLES,DOOS,PAK>;

    type Artikel{
        titel: Text{
            constraint exclusive;
        };
        eenheid:Unit;
    }

    type ArtikelItem{
        artikel:Artikel;
        hoeveelheid:int64;
        user:str;
    }
}
