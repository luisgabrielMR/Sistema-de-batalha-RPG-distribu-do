const MAX_LOG_ITEMS = 8;

const OUTCOMES = {
  IN_PROGRESS: 'BATTLE_IN_PROGRESS',
  PLAYER_WON: 'PLAYER_WON',
  MONSTER_WON: 'MONSTER_WON',
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

class BattleGame {
  constructor() {
    this.reset();
  }

  reset() {
    this.player = {
      name: 'Guerreiro',
      role: 'Jogador',
      hp: 100,
      maxHp: 100,
    };
    this.monster = {
      name: 'Dragao de gRPC',
      role: 'Inimigo',
      hp: 120,
      maxHp: 120,
    };
    this.potionsLeft = 3;
    this.turn = 1;
    this.log = [
      'A batalha comecou: o Dragao de gRPC protege o contrato .proto.',
    ];
  }

  get outcome() {
    if (this.monster.hp <= 0) {
      return OUTCOMES.PLAYER_WON;
    }
    if (this.player.hp <= 0) {
      return OUTCOMES.MONSTER_WON;
    }
    return OUTCOMES.IN_PROGRESS;
  }

  get isFinished() {
    return this.outcome !== OUTCOMES.IN_PROGRESS;
  }

  status() {
    return this.toProtoState();
  }

  attack(actorName) {
    if (this.isFinished) {
      return this.result(false, 'A batalha ja terminou. Reinicie para jogar novamente.');
    }

    const attacker = actorName?.trim() || this.player.name;
    const baseDamage = randomInt(16, 28);
    const critical = Math.random() < 0.2;
    const damage = critical ? baseDamage + randomInt(8, 14) : baseDamage;

    this.monster.hp = clamp(this.monster.hp - damage, 0, this.monster.maxHp);

    const critText = critical ? ' Golpe critico!' : '';
    this.addLog(`${attacker} atacou e causou ${damage} de dano.${critText}`);

    if (this.monster.hp <= 0) {
      this.addLog('O Dragao de gRPC caiu. O contrato foi cumprido.');
      return this.result(true, `Voce venceu! ${attacker} derrotou o Dragao de gRPC.`);
    }

    this.monsterTurn();
    this.turn += 1;

    if (this.player.hp <= 0) {
      return this.result(true, 'O Dragao de gRPC venceu esta rodada.');
    }

    return this.result(true, `${attacker} atacou. O Dragao contra-atacou.`);
  }

  usePotion(actorName) {
    if (this.isFinished) {
      return this.result(false, 'A batalha ja terminou. Reinicie para jogar novamente.');
    }

    if (this.potionsLeft <= 0) {
      return this.result(false, 'Voce nao tem mais pocoes.');
    }

    if (this.player.hp >= this.player.maxHp) {
      return this.result(false, 'Seu HP ja esta cheio.');
    }

    const user = actorName?.trim() || this.player.name;
    const heal = randomInt(24, 36);
    const before = this.player.hp;
    this.player.hp = clamp(this.player.hp + heal, 0, this.player.maxHp);
    this.potionsLeft -= 1;

    this.addLog(`${user} usou uma pocao e recuperou ${this.player.hp - before} HP.`);
    this.monsterTurn();
    this.turn += 1;

    if (this.player.hp <= 0) {
      return this.result(true, 'A pocao ajudou, mas o Dragao finalizou o combate.');
    }

    return this.result(true, `${user} usou uma pocao. O Dragao respondeu ao turno.`);
  }

  resetBattle() {
    this.reset();
    return this.result(true, 'Batalha reiniciada.');
  }

  monsterTurn() {
    const damage = randomInt(10, 22);
    const fireBreath = Math.random() < 0.25;
    const finalDamage = fireBreath ? damage + randomInt(6, 10) : damage;

    this.player.hp = clamp(this.player.hp - finalDamage, 0, this.player.maxHp);

    if (fireBreath) {
      this.addLog(`O Dragao cuspiu fogo e causou ${finalDamage} de dano.`);
      return;
    }

    this.addLog(`O Dragao atacou com as garras e causou ${finalDamage} de dano.`);
  }

  addLog(message) {
    this.log.push(message);
    if (this.log.length > MAX_LOG_ITEMS) {
      this.log = this.log.slice(this.log.length - MAX_LOG_ITEMS);
    }
  }

  result(success, message) {
    return {
      success,
      message,
      state: this.toProtoState(),
    };
  }

  toProtoState() {
    return {
      player: this.toProtoCombatant(this.player),
      monster: this.toProtoCombatant(this.monster),
      outcome: this.outcome,
      potions_left: this.potionsLeft,
      turn: this.turn,
      log: [...this.log],
    };
  }

  toProtoCombatant(combatant) {
    return {
      name: combatant.name,
      role: combatant.role,
      hp: combatant.hp,
      max_hp: combatant.maxHp,
      alive: combatant.hp > 0,
    };
  }
}

module.exports = {
  BattleGame,
  OUTCOMES,
};
