<template>
  <q-page class="q-ma-lg">
    <div class="row justify-center">
      <div class="col-lg-4 col-md-6 col-xs-12">
        <div
          v-if="errorLoading"
          class="text-center"
        >
          <p>Error loading data.</p>
          <q-btn
            label="Retry"
            @click="reloadAxie"
          />
        </div>

        <div v-if="axieData">
          <div class="text-center">
            <a
              :href="`https://marketplace.axieinfinity.com/axie/${axieData.id}`"
              target="_blank"
              class="axie-link"
              :class="[`bg-${axieData.class}`]"
            >#{{ axieData.id }}</a>
          </div>

          <h1 class="text-h5 text-center q-ma-none">
            {{ axieData.name }}
          </h1>

          <div class="axie-image">
            <q-img
              :src="axieData.image"
              class="image"
            />
          </div>

          <h2 class="text-h6">
            Stats
          </h2>

          <q-markup-table
            dense
            separator="vertical"
          >
            <thead>
              <tr>
                <th class="text-left">
                  Class
                </th>
                <th class="text-right">
                  Health
                </th>
                <th class="text-right">
                  Speed
                </th>
                <th class="text-right">
                  Skill
                </th>
                <th class="text-right">
                  Morale
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span
                    class="axie-link"
                    :class="[`bg-${axieData.class}`]"
                  >
                    {{ axieData.class }}
                  </span>
                </td>
                <td class="text-right">
                  {{ axieData.stats.hp }}
                </td>
                <td class="text-right">
                  {{ axieData.stats.speed }}
                </td>
                <td class="text-right">
                  {{ axieData.stats.skill }}
                </td>
                <td class="text-right">
                  {{ axieData.stats.morale }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>

          <h2 class="text-h6 q-mt-lg q-mb-none">
            Damage against
          </h2>

          <q-tabs
            v-model="damageAgainst"
          >
            <q-tab name="1">
              <template #default>
                <div>
                  <span class="damage-type bg-Plant" />
                  <span class="damage-type bg-Reptile" />
                  <span class="damage-type bg-Dusk" />
                </div>
              </template>
            </q-tab>

            <q-tab name="2">
              <template #default>
                <div>
                  <span class="damage-type bg-Aquatic" />
                  <span class="damage-type bg-Bird" />
                  <span class="damage-type bg-Dawn" />
                </div>
              </template>
            </q-tab>

            <q-tab name="3">
              <template #default>
                <div>
                  <span class="damage-type bg-Beast" />
                  <span class="damage-type bg-Bug" />
                  <span class="damage-type bg-Mech" />
                </div>
              </template>
            </q-tab>
          </q-tabs>

          <q-markup-table
            dense
            separator="vertical"
          >
            <thead>
              <tr>
                <th class="text-left">
                  Card
                </th>
                <th class="text-left">
                  Use
                </th>
                <th class="text-left">
                  Effect
                </th>
                <th class="text-right">
                  Atq
                </th>
                <th class="text-right">
                  Damage
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="card in axieCards"
                :key="card.id"
              >
                <td class="card-name">
                  <a
                    href="#"
                    :class="[`text-${card.class}`]"
                    @click.prevent="showCard(card.id)"
                  >{{ card.name }}
                  </a>
                </td>
                <td class="text-right">
                  <q-checkbox
                    v-model="cardUse[card.id]"
                    size="xs"
                  />
                </td>
                <td class="text-right">
                  <q-checkbox
                    v-if="cardBonus[card.id] != null"
                    v-model="cardBonus[card.id]"
                    size="xs"
                  />
                </td>
                <td class="text-right">
                  {{ card.attack }}
                </td>
                <td class="text-right">
                  {{ cardDamage[card.id] }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th class="text-left">
                  Total
                </th>
                <th
                  colspan="4"
                  class="text-right"
                >
                  {{ totalDamage }}
                </th>
              </tr>
            </tfoot>
          </q-markup-table>
        </div>
      </div>
    </div>

    <q-dialog v-model="showingCard">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div
            class="text-h6"
            :class="[`text-${showCardData.class}`]"
          >
            {{ showCardData.name }}
          </div>
          <q-space />
          <q-btn
            v-close-popup
            icon="close"
            flat
            round
            dense
          />
        </q-card-section>

        <q-card-section>
          <q-markup-table
            dense
            separator="vertical"
          >
            <thead>
              <tr>
                <th class="text-right">
                  Attack
                </th>
                <th class="text-right">
                  Defense
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-right">
                  {{ showCardData.attack }}
                </td>
                <td class="text-right">
                  {{ showCardData.defense }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>

          <div class="q-mt-md text-subtitle1 text-weight-bold">
            Effect
          </div>
          <p>{{ showCardData.description }}</p>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { mktApi } from 'boot/axios'
import { cardsModifier, damageGroups, damageGroupModifier } from 'src/components/cards-bonus'

export default {
  name: 'PageIndex',
  setup () {
    const $q = useQuasar()
    const $route = useRoute()

    const errorLoading = ref(false)

    const axieId = computed(() => $route.params.axieId)
    const axieData = ref()
    const axieCards = ref()
    const cardUse = ref()
    const cardBonus = ref()

    const loadAxie = async function (axieId) {
      $q.loading.show()

      errorLoading.value = false
      axieData.value = null
      axieCards.value = []

      try {
        const res = await mktApi.post(
          '/graphql',
          {
            operationName: 'GetAxieDetail',
            variables: { axieId },
            query: `query GetAxieDetail($axieId: ID!) {
  axie(axieId: $axieId) {
    ...AxieDetail
  }
}

fragment AxieDetail on Axie {
  id
  image
  class
  name
  parts {
    ...AxiePart
  }
  stats {
    ...AxieStats
    __typename
  }
}

fragment AxiePart on AxiePart {
  id
  name
  class
  type
  specialGenes
  stage
  abilities {
    ...AxieCardAbility
  }
}

fragment AxieCardAbility on AxieCardAbility {
  id
  name
  attack
  defense
  energy
  description
  backgroundUrl
  effectIconUrl
}

fragment AxieStats on AxieStats {
  hp
  speed
  skill
  morale
}
`
          }
        )
        axieData.value = res.data.data.axie

        const newCards = {}
        const newUse = {}
        const newBonus = {}
        const newDamage = {}

        for (const part of axieData.value.parts) {
          if (part.abilities.length === 0) {
            continue
          }

          const ability = part.abilities[0]
          const cls = ability.id.split('-')[0]

          newCards[ability.id] = {
            ...ability,
            class: cls[0].toUpperCase() + cls.substr(1),
            modifier: () => 0
          }

          newUse[ability.id] = false

          newBonus[ability.id] = false
          if (cardsModifier[ability.id] == null) {
            newBonus[ability.id] = null
          }

          newDamage[ability.id] = 0
        }
        axieCards.value = newCards
        cardUse.value = newUse
        cardBonus.value = newBonus
      } catch (e) {
        errorLoading.value = true
      } finally {
        $q.loading.hide()
      }
    }

    const damageAgainst = ref('1')

    const cardDamage = computed(() => {
      const chain = {}

      for (const key in axieCards.value) {
        const cls = axieCards.value[key].class

        if (cardUse.value[key]) {
          chain[cls] = (chain[cls] || 0) + 1
        }
      }

      const damage = {}

      for (const key in axieCards.value) {
        const card = axieCards.value[key]

        if (cardUse.value[key]) {
          const dmgMod = damageGroupModifier[damageGroups[card.class]][damageAgainst.value]

          damage[key] = card.attack * dmgMod

          console.log(card.class, axieData.value.class)

          if (card.class === axieData.value.class) {
            damage[key] = damage[key] * 1.1
          } else if (damageGroups[card.class] === damageGroups[axieData.value.class]) {
            damage[key] = damage[key] * 1.075
          }

          if (cardBonus.value[key]) {
            damage[key] = cardsModifier[key](damage[key])
          }

          if (chain[card.class] > 1) {
            damage[key] += (card.attack * axieData.value.stats.skill) / 500
          }

          damage[key] = Math.floor(damage[key])
        } else {
          damage[key] = 0
        }
      }
      return damage
    })

    const totalDamage = computed(() => Object.values(cardDamage.value).reduce((total, val) => total + val, 0))

    const reloadAxie = function () {
      loadAxie(axieId.value)
    }

    loadAxie(axieId.value)

    const showingCard = ref(false)
    const showCardData = ref()
    const showCard = function (id) {
      showCardData.value = axieCards.value[id]
      showingCard.value = true
    }

    watch(
      () => axieId.value,
      async (newId) => {
        await loadAxie(newId)
      }
    )

    return {
      errorLoading,
      reloadAxie,
      axieData,
      axieCards,
      cardUse,
      cardBonus,
      damageAgainst,
      cardDamage,
      totalDamage,
      showingCard,
      showCardData,
      showCard
    }
  }
}
</script>

<style scoped lang="scss">
$aquatic-color: #00b8ce;
$beast-color: #ffb812;
$bird-color: #ff8bbd;
$bug-color: #ff5341;
$dawn-color: #beceff;
$dusk-color: #129092;
$mech-color: #c6bdd4;
$plant-color: #6cc000;
$reptile-color: #dc8be4;

.bg-Aquatic {
  background-color: $aquatic-color;
}
.bg-Beast {
  background-color: $beast-color;
}
.bg-Bird {
  background-color: $bird-color;
}
.bg-Bug {
  background-color: $bug-color;
}
.bg-Dawn {
  background-color: $dawn-color;
}
.bg-Dusk {
  background-color: $dusk-color;
}
.bg-Mech {
  background-color: $mech-color;
}
.bg-Plant {
  background-color: $plant-color;
}
.bg-Reptile {
  background-color: $reptile-color;
}

.text-Aquatic {
  color: $aquatic-color;
}
.text-Beast {
  color: $beast-color;
}
.text-Bird {
  color: $bird-color;
}
.text-Bug {
  color: $bug-color;
}
.text-Dawn {
  color: $dawn-color;
}
.text-Dusk {
  color: $dusk-color;
}
.text-Mech {
  color: $mech-color;
}
.text-Plant {
  color: $plant-color;
}
.text-Reptile {
  color: $reptile-color;
}

a {
  text-decoration: none;
}

.axie-link {
  padding: 3px 6px;
  color: white;
  border-radius: 5px;
}

.axie-image {
  text-align: center;

  .image {
    width: 200px;
    text-align: center;
    margin-top: -25px;
    margin-bottom: -15px;
  }
}

.card-name {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;

  a {
    text-decoration: underline dotted;
  }
}

$damage-border-radius: 5px;

.damage-type {
  display: inline-block;
  width: 20px;
  height: 20px;

  &:first-child {
    border-top-left-radius: $damage-border-radius;
    border-bottom-left-radius: $damage-border-radius;
    border-right: 1px solid white;
  }

  &:last-child {
    border-top-right-radius: $damage-border-radius;
    border-bottom-right-radius: $damage-border-radius;
    border-left: 1px solid white;
  }
}
</style>
