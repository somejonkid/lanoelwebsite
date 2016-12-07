export class Game{
    free: Boolean;
    gameKey: Number;
    gameName: String;
    location: String;
    numUniquePersonVotes: Number;
    rules: String;
    steamGame: SteamGame;
    steamInfo: SteamInfo;
    voteTotal: Number;
}

class SteamGame{
    appid: Number;
    name: String;
}

class SteamInfo{
    about_the_game: String;
      background: String;
      categories: Categories[] = new Array<Categories>();
      detailed_description: String;
      header_image: String;
      name: String;
      price_overview: PriceOverview;
      steam_appid: Number;
}

class Categories{
    description: String;
}

class PriceOverview {
    final: Number;
    initial: Number;
}